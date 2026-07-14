// src/components/common/Navbar.jsx
export function Navbar({ username, isConnected, usersCount, onLogout }) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-lg">✏️ CodeSync</span>
        <span className={`text-sm px-3 py-1 rounded-full ${
          isConnected ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
        }`}>
          {isConnected ? '● Online' : '○ Offline'}
        </span>
        <span className="text-xs text-gray-500">
          👥 {usersCount} user{usersCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          👋 Welcome, <strong className="text-amber-400">{username}</strong>
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors text-sm font-medium"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}