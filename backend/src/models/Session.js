// backend/src/models/Session.js
export const sessions = [];

export const createSession = (userId, socketId) => {
  const session = {
    userId,
    socketId,
    joinedAt: new Date().toISOString(),
  };
  sessions.push(session);
  return session;
};

export const removeSession = (socketId) => {
  const index = sessions.findIndex(s => s.socketId === socketId);
  if (index !== -1) {
    sessions.splice(index, 1);
    return true;
  }
  return false;
};

export const getSessions = () => {
  return sessions;
};