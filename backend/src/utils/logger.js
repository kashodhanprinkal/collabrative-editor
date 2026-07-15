// backend/src/utils/logger.js
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(level, color, ...args) {
  const timestamp = getTimestamp();
  console.log(
    `${colors.dim}[${timestamp}]${colors.reset}`,
    `${color}[${level}]${colors.reset}`,
    ...args
  );
}

export const logger = {
  info: (...args) => log('INFO', colors.blue, ...args),
  warn: (...args) => log('WARN', colors.yellow, ...args),
  error: (...args) => log('ERROR', colors.red, ...args),
  success: (...args) => log('SUCCESS', colors.green, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      log('DEBUG', colors.magenta, ...args);
    }
  },
};