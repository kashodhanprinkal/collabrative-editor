// backend/src/utils/helpers.js
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const getCurrentTime = () => {
  return new Date().toISOString();
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};