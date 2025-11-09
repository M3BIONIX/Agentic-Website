/**
 * Emit a success event back to the agent runtime.
 * @param {string} toolName
 * @param {object} data
 */
export function dispatchSuccess(toolName, data) {
  document.dispatchEvent(
    new CustomEvent(`${toolName}_success`, {
      detail: {
        tool: toolName,
        success: true,
        data,
        timestamp: Date.now()
      },
      bubbles: true
    })
  );
}

/**
 * Emit an error event back to the agent runtime.
 * @param {string} toolName
 * @param {string} error
 */
export function dispatchError(toolName, error) {
  document.dispatchEvent(
    new CustomEvent(`${toolName}_error`, {
      detail: {
        tool: toolName,
        success: false,
        error,
        timestamp: Date.now()
      },
      bubbles: true
    })
  );
}


