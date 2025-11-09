import { fillFormField } from '../utils/forms.js';
import { setStatus, updateLastEvent } from '../ui/status.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';

const TOOL_FILL = 'contact_form_fill';
const TOOL_SUBMIT = 'contact_form_submit';

/**
 * Handle agent request to populate the contact form.
 * @param {CustomEvent} event
 */
function handleFillContactForm(event) {
  const args = event.detail?.args ?? {};
  log(`Filling contact form with: ${JSON.stringify(args)}`);

  const results = {
    name: args.name ? fillFormField('#name', args.name) : false,
    email: args.email ? fillFormField('#email', args.email) : false,
    message: args.message ? fillFormField('#message', args.message) : !args.message
  };

  const requiredSatisfied = Boolean(results.name && results.email);

  if (requiredSatisfied) {
    setStatus('Form filled successfully by AI agent', 'success');
    dispatchSuccess(TOOL_FILL, { filled: results });
    log('Contact form filled successfully', 'success');
  } else {
    setStatus('Some required fields were not filled', 'warning');
    dispatchError(TOOL_FILL, 'Required fields missing');
    log('Contact form filling incomplete', 'warning');
  }

  updateLastEvent(TOOL_FILL);
  event.preventDefault();
}

/**
 * Handle agent request to submit the contact form.
 * @param {CustomEvent} event
 */
function handleSubmitContactForm(event) {
  log('Submitting contact form');

  const form = document.getElementById('contact-form');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');

  if (!form || !nameField || !emailField) {
    const errorMessage = 'Contact form elements not found';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_SUBMIT, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_SUBMIT);
    return;
  }

  if (!nameField.value || !emailField.value) {
    const errorMessage = 'Cannot submit: form is incomplete';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_SUBMIT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SUBMIT);
    event.preventDefault();
    return;
  }

  if (form.checkValidity()) {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.click();
      log('Form submit button clicked', 'success');
    } else {
      form.requestSubmit();
      log('Form submitted via requestSubmit()', 'success');
    }

    setStatus('Form submitted by AI agent', 'success');
    dispatchSuccess(TOOL_SUBMIT, { submitted: true });
  } else {
    const errorMessage = 'Form validation failed';
    setStatus(`Cannot submit: ${errorMessage}`, 'error');
    dispatchError(TOOL_SUBMIT, errorMessage);
    log(errorMessage, 'error');
  }

  updateLastEvent(TOOL_SUBMIT);
  event.preventDefault();
}

/**
 * Wire human-driven submission handlers for UX parity.
 */
function registerUserFormHandlers() {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    log('Form submitted by user', 'info');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form data:', data);
    setStatus('Form submitted successfully!', 'success');
    form.reset();
  });
}

let userHandlersRegistered = false;

/**
 * Register contact-form tool listeners on the provided targets.
 * @param {Array<EventTarget>} targets
 */
function registerToolListeners(targets) {
  targets.forEach((target) => {
    target.addEventListener(TOOL_FILL, handleFillContactForm);
    target.addEventListener(TOOL_SUBMIT, handleSubmitContactForm);
  });

  return () => {
    targets.forEach((target) => {
      target.removeEventListener(TOOL_FILL, handleFillContactForm);
      target.removeEventListener(TOOL_SUBMIT, handleSubmitContactForm);
    });
  };
}

/**
 * Initialize all contact-form related functionality.
 */
export function registerContactTools() {
  const targets = [document, window];
  const teardown = registerToolListeners(targets);

  if (!userHandlersRegistered) {
    registerUserFormHandlers();
    userHandlersRegistered = true;
  }

  return teardown;
}
