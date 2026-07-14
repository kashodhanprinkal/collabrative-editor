// src/components/Editor/main.jsx
import { useRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';

function Editor() {
  const editorRef = useRef(null);

  // Temporary mock data
  const username = "TestUser";
  const users = [{ username: "TestUser" }, { username: "Alice" }, { username: "Bob" }];
  const isConnected = true;

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    console.log('Editor mounted');
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col">
      <Navbar 
        username={username} 
        isConnected={isConnected} 
        usersCount={users.length}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <Sidebar users={users} currentUser={username} />
        
        <section className="flex-1 bg-neutral-800 rounded-lg overflow-hidden">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Welcome to collaborative editing!"
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default Editor;  // ← MUST HAVE THIS