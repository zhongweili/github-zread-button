/**
 * Logger utility to control console output based on environment
 * Only logs debug messages in development mode
 */
const isDev = process.env.NODE_ENV === 'development' || typeof import.meta.env !== 'undefined' && import.meta.env.DEV;

export const logger = {
  log: isDev ? console.log.bind(console) : () => {},
  debug: isDev ? console.debug.bind(console) : () => {},
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
