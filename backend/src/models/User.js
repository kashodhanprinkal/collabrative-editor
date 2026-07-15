// backend/src/models/User.js
// Mock user data - will be replaced with MongoDB later
export const users = [
  {
    id: '1',
    username: 'john',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
  },
  {
    id: '2',
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    id: '3',
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123',
  },
];

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

export const validateUser = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};