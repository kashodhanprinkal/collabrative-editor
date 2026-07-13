// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Login } from '../components/Auth/Login';
import { SignUp } from '../components/Auth/SignUp';
import './App.css';

function EditorApp() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('codesync_username') || '';
  });
  const editorRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = useCallback((editor) => {
    editorRef.current = editor;
    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current])
    );
  }, [yText]);

  const handleLogout = () => {
    localStorage.removeItem('codesync_username');
    setUsername('');
  };

  useEffect(() => {
    let provider = null;

    if (username) {
      const SERVER_URL = "http://localhost:3000";
      
      provider = new SocketIOProvider(SERVER_URL, "monaco", ydoc, {
        autoConnect: true,
      });

      provider.awareness.setLocalStateField("user", { username });

      const initialStates = Array.from(provider.awareness.getStates().values());
      const initialUsers = initialStates
        .filter((state) => state.user && state.user.username)
        .map((state) => state.user);
      setUsers(initialUsers);

      const handleAwarenessChange = () => {
        const states = Array.from(provider.awareness.getStates().values());
        const updatedUsers = states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user);
        setUsers(updatedUsers);
      };

      provider.awareness.on("change", handleAwarenessChange);
      provider.on("status", ({ status }) => {
        setIsConnected(status === "connected");
      });

      const handleBeforeUnload = () => {
        provider.awareness.setLocalStateField("user", null);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.awareness.off("change", handleAwarenessChange);
        provider.off("status");
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [username, ydoc]);

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">
            👋 Welcome, <span className="text-amber-400">{username}</span>
          </span>
          <span className={`text-sm ${isConnected ? "text-green-400" : "text-red-400"}`}>
            {isConnected ? "● Online" : "○ Offline"}
          </span>
          <span className="text-xs text-gray-500">
            {users.length} user{users.length !== 1 ? 's' : ''} online
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors text-sm font-medium"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 rounded-lg overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              👥 Online Users
              <span className="text-sm font-normal text-gray-400">({users.length})</span>
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {users.length > 0 ? (
              <ul className="space-y-1.5">
                {users.map((userItem, index) => (
                  <li
                    key={index}
                    className={`p-2.5 rounded-lg flex items-center gap-2 ${
                      userItem.username === username
                        ? "bg-amber-400/20 border border-amber-400/30 text-amber-400"
                        : "bg-gray-800/50 text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="flex-1">
                      {userItem.username === username ? `${userItem.username} (You)` : userItem.username}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-400 mt-8">
                <p className="text-4xl mb-2">👤</p>
                <p>No other users online</p>
              </div>
            )}
          </div>
        </aside>

        {/* Editor */}
        <section className="flex-1 bg-neutral-800 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Welcome to collaborative editing!"
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </section>
      </div>
    </main>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<EditorApp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;