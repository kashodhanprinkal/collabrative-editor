// backend/src/models/User.js
// Mock user data - will be replaced with MongoDB later

export const users = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: '2',
    username: 'alice_dev',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    id: '3',
    username: 'bob_coder',
    email: 'bob@example.com',
    password: 'password123',
  },
];

// Helper functions to find users
export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Validate user credentials
export const validateUser = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Create new user (for signup)
export const createUser = (username, email, password) => {
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In real app, this would be hashed
  };
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};