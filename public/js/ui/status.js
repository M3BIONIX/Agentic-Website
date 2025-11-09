/**
 * UI helpers for conveying agent status to users.
 */

const STATUS_TIMEOUT_MS = 3000;

/**
 * Append a message to the on-page event log.
 * @param {string} message
 */
export function appendEventLog(message) {
  const logEl = document.getElementById('event-log');
  if (!logEl) {
    return;
  }

  const timestamp = new Date().toLocaleTimeString();
  logEl.innerHTML = `<div>${timestamp}: ${message}</div>` + logEl.innerHTML;
}

/**
 * Present a transient status message to the user.
 * @param {string} message
 * @param {'info' | 'success' | 'warning' | 'error'} type
 */
export function setStatus(message, type = 'info') {
  const statusEl = document.getElementById('form-status');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;

  window.clearTimeout(Number(statusEl.dataset.timeoutId));

  const timeoutId = window.setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = '';
  }, STATUS_TIMEOUT_MS);

  statusEl.dataset.timeoutId = String(timeoutId);
}

/**
 * Update the "last event" indicator in the debug panel.
 * @param {string} eventName
 */
export function updateLastEvent(eventName) {
  const lastEventEl = document.getElementById('last-event');
  if (!lastEventEl) {
    return;
  }

  lastEventEl.textContent = `Last event: ${eventName} at ${new Date().toLocaleTimeString()}`;
}

