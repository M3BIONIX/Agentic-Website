import { CONFIG } from '../config.js';
import { appendEventLog } from '../ui/status.js';

const CONSOLE_METHODS = {
  info: console.log,
  success: console.log,
  warning: console.warn,
  error: console.error
};

/**
 * Log an agent-related message for debugging and diagnostics.
 * @param {string} message
 * @param {'info' | 'success' | 'warning' | 'error'} type
 */
export function log(message, type = 'info') {
  if (!CONFIG.debug) {
    return;
  }

  const consoleFn = CONSOLE_METHODS[type] || console.log;
  const prefix = '[AI Agent Handler]';
  consoleFn.call(console, `${prefix} [${type.toUpperCase()}] ${message}`);
  appendEventLog(message);
}


