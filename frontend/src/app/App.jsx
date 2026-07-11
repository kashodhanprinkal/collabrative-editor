import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
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

  const handleJoin = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUsername = formData.get("username");
    setUsername(newUsername);
    window.history.pushState({}, "", "?username=" + newUsername);
  }, []);

  useEffect(() => {
    let provider = null;

    if (username) {
      // Connect to your WebSocket server
      // Make sure this matches your server URL
      const SERVER_URL = "http://localhost:3000"; // Adjust this
      
      provider = new SocketIOProvider(SERVER_URL, "monaco", ydoc, {
        autoConnect: true,
      });

      // Set local user state
      provider.awareness.setLocalStateField("user", { username });

      // Initial users
      const initialStates = Array.from(provider.awareness.getStates().values());
      const initialUsers = initialStates
        .filter((state) => state.user && state.user.username)
        .map((state) => state.user);
      setUsers(initialUsers);

      // Update users on change
      const handleAwarenessChange = () => {
        const states = Array.from(provider.awareness.getStates().values());
        const updatedUsers = states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user);
        setUsers(updatedUsers);
      };

      provider.awareness.on("change", handleAwarenessChange);

      // Handle connection status
      provider.on("status", ({ status }) => {
        setIsConnected(status === "connected");
      });

      // Clean up before unload
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
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4 w-80 bg-gray-900 p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Collaborative Editor
          </h1>
          <input
            type="text"
            placeholder="Enter your username"
            className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            name="username"
            required
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-amber-400 text-gray-950 font-bold hover:bg-amber-300 transition-colors"
          >
            Join Session
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">👥 Users</h2>
          <span className={`text-sm ${
            isConnected ? "text-green-400" : "text-red-400"
          }`}>
            {isConnected ? "● Online" : "○ Offline"}
          </span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((user, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg ${
                    user.username === username
                      ? "bg-amber-400 text-gray-950 font-semibold"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {user.username === username ? `${user.username} (You)` : user.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center mt-4">
              No other users connected
            </p>
          )}
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-700 pt-4">
            <p>Total: {users.length} user{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </aside>
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
          }}
        />
      </section>
    </main>
  );
}

export default App;