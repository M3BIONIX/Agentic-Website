import { log } from './logger.js';

/**
 * Retrieve a DOM field using a selector or element reference.
 * @param {string | HTMLElement} selector
 * @returns {HTMLElement | null}
 */
function resolveField(selector) {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }
  return selector ?? null;
}

/**
 * Populate a form field and trigger common validation events.
 * @param {string | HTMLElement} selector
 * @param {string} value
 * @returns {boolean}
 */
export function fillFormField(selector, value) {
  const field = resolveField(selector);

  if (!field) {
    log(`Field not found: ${selector}`, 'warning');
    return false;
  }

  try {
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.value = value;
    } else if (field instanceof HTMLElement && field.isContentEditable) {
      field.textContent = value;
    } else {
      log(`Unsupported field type for: ${selector}`, 'warning');
      return false;
    }

    ['input', 'change', 'blur'].forEach((eventName) => {
      field.dispatchEvent(new Event(eventName, { bubbles: true }));
    });

    field.focus();
    log(`Filled field ${selector} with: ${value}`, 'success');
    return true;
  } catch (error) {
    log(`Error filling field ${selector}: ${error.message}`, 'error');
    return false;
  }
}

