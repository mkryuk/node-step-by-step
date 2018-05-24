import { testConfig } from './config.test';

let config = {
  IP: process.env.NODEJS_IP || '127.0.0.1',
  PORT: process.env.PORT || normalizePort('3000'),
  SECRET_TOKEN_KEY: process.env.TOKEN_SECRET || '#tokenSecret#',
  FS_DATA_USERS_PATH: process.env.FS_DATA_USERS_PATH || './data/users.json',
  FS_DATA_TODOS_PATH: process.env.FS_DATA_TODOS_PATH || './data/todos.json',
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/node_step_by_step',
};

/**
 * Normalize port into a number, string, or false.
 */

export function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
}

if (process.env.NODE_ENV === 'test') {
  config = { ...config, ...testConfig };
}

export { config };
