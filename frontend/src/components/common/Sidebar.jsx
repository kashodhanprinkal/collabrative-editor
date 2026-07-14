// src/components/common/Sidebar.jsx
export function Sidebar({ users, currentUser }) {
  return (
    <aside className="w-64 bg-gray-900 rounded-lg overflow-hidden flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">👥 Online Users</h2>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
          {users.length}
        </span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {users.length > 0 ? (
          <ul className="space-y-1.5">
            {users.map((user, index) => (
              <li 
                key={index}
                className={`p-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                  user.username === currentUser
                    ? 'bg-amber-400/20 border border-amber-400/30'
                    : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                <span className={`flex-1 text-sm ${
                  user.username === currentUser ? 'text-amber-400 font-medium' : 'text-white'
                }`}>
                  {user.username === currentUser ? `${user.username} (You)` : user.username}
                </span>
                {user.username === currentUser && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                    You
                  </span>
                )}
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
  );
}