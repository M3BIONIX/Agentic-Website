import { fillFormField } from '../utils/forms.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';
import { updateLastEvent } from '../ui/status.js';

const TOOL_FORM_FILL = 'consultation_form_fill';
const TOOL_FORM_SUBMIT = 'consultation_form_submit';
const TOOL_FAQ_REVEAL = 'faq_reveal';

function setConsultationStatus(message, type = 'info') {
  const statusEl = document.getElementById('consultation-status');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function getConsultationElements() {
  return {
    form: document.getElementById('consultation-form'),
    name: document.getElementById('consultation-name'),
    company: document.getElementById('consultation-company'),
    objective: document.getElementById('consultation-objective'),
    preferredDate: document.getElementById('consultation-preferred-date'),
    preferredTime: document.getElementById('consultation-preferred-time')
  };
}

function handleConsultationFormFill(event) {
  const args = event.detail?.args ?? {};
  const elements = getConsultationElements();
  const missingElements = Object.entries(elements)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missingElements.length) {
    const errorMessage = `Consultation form elements missing: ${missingElements.join(', ')}`;
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FORM_FILL, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_FORM_FILL);
    event.preventDefault();
    return;
  }

  const results = {
    name: args.name ? fillFormField(elements.name, args.name) : false,
    company: args.company ? fillFormField(elements.company, args.company) : true,
    objective: args.objective ? fillFormField(elements.objective, args.objective) : false,
    preferredDate: args.preferredDate ? fillFormField(elements.preferredDate, args.preferredDate) : false,
    preferredTime: args.preferredTime ? fillFormField(elements.preferredTime, args.preferredTime) : true
  };

  const requiredSatisfied = Boolean(results.name && results.objective && results.preferredDate);

  if (!requiredSatisfied) {
    const errorMessage = 'Missing required fields: name, objective, and preferredDate are mandatory.';
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FORM_FILL, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_FORM_FILL);
    event.preventDefault();
    return;
  }

  setConsultationStatus('Consultation form populated by agent', 'success');
  dispatchSuccess(TOOL_FORM_FILL, { filled: results });
  log('Consultation form filled successfully', 'success');
  updateLastEvent(TOOL_FORM_FILL);
  event.preventDefault();
}

function handleConsultationFormSubmit(event) {
  const elements = getConsultationElements();
  const { form, name, objective, preferredDate } = elements;

  if (!form || !name || !objective || !preferredDate) {
    const errorMessage = 'Cannot submit: consultation form elements missing.';
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FORM_SUBMIT, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_FORM_SUBMIT);
    event.preventDefault();
    return;
  }

  if (!name.value || !objective.value || !preferredDate.value) {
    const errorMessage = 'Cannot submit: required consultation fields are empty.';
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FORM_SUBMIT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_FORM_SUBMIT);
    event.preventDefault();
    return;
  }

  const simulatedResponse = {
    name: name.value,
    objective: objective.value,
    preferredDate: preferredDate.value,
    preferredTime: elements.preferredTime?.value ?? null
  };

  setConsultationStatus('Consultation request submitted. We will confirm soon!', 'success');
  dispatchSuccess(TOOL_FORM_SUBMIT, { submitted: simulatedResponse });
  log('Consultation form submitted by agent', 'success');
  updateLastEvent(TOOL_FORM_SUBMIT);

  form.reset();
  event.preventDefault();
}

function handleFaqReveal(event) {
  const args = event.detail?.args ?? {};
  const faqId = args.faqId;

  if (!faqId) {
    const errorMessage = 'faqId is required to reveal an FAQ entry.';
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FAQ_REVEAL, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_FAQ_REVEAL);
    event.preventDefault();
    return;
  }

  const entry = document.querySelector(`[data-faq-id="${CSS.escape(faqId)}"]`);

  if (!entry) {
    const errorMessage = `FAQ entry not found for id "${faqId}".`;
    setConsultationStatus(errorMessage, 'error');
    dispatchError(TOOL_FAQ_REVEAL, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_FAQ_REVEAL);
    event.preventDefault();
    return;
  }

  entry.open = true;
  entry.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const successMessage = `FAQ "${faqId}" revealed.`;
  setConsultationStatus(successMessage, 'info');
  dispatchSuccess(TOOL_FAQ_REVEAL, { faqId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_FAQ_REVEAL);
  event.preventDefault();
}

function registerUserFormHandlers() {
  const elements = getConsultationElements();
  const { form } = elements;

  if (!form) {
    return;
  }

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const payload = new FormData(form);
    log(`Consultation form submitted by user: ${JSON.stringify(Object.fromEntries(payload.entries()))}`, 'info');
    setConsultationStatus('Consultation request received. Watch your inbox!', 'success');
    form.reset();
  });
}

let userHandlersRegistered = false;

export function registerConsultationTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_FORM_FILL, handleConsultationFormFill);
    target.addEventListener(TOOL_FORM_SUBMIT, handleConsultationFormSubmit);
    target.addEventListener(TOOL_FAQ_REVEAL, handleFaqReveal);
  });

  if (!userHandlersRegistered) {
    registerUserFormHandlers();
    userHandlersRegistered = true;
  }

  return () => {
    targets.forEach((target) => {
      target.removeEventListener(TOOL_FORM_FILL, handleConsultationFormFill);
      target.removeEventListener(TOOL_FORM_SUBMIT, handleConsultationFormSubmit);
      target.removeEventListener(TOOL_FAQ_REVEAL, handleFaqReveal);
    });
  };
}

