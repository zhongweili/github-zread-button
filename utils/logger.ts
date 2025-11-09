/**
 * Logger utility to control console output based on environment
 * Only logs debug messages in development mode
 */
export const logger = {
  log: import.meta.env.DEV ? console.log.bind(console) : () => {},
  debug: import.meta.env.DEV ? console.debug.bind(console) : () => {},
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
