import { fillFormField } from '../utils/forms.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';
import { updateLastEvent } from '../ui/status.js';

const TOOL_SECTION_FOCUS = 'doc_section_focus';
const TOOL_PLAYBOOK_EXPAND = 'playbook_expand';
const TOOL_TRAINING_FILL = 'training_request_fill';

const SECTION_HIGHLIGHT_CLASS = 'doc-section-focus';

let highlightedSection = null;

function setTrainingStatus(message, type = 'info') {
  const statusEl = document.getElementById('training-status');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function focusDocSection(sectionId) {
  const section = document.querySelector(`[data-doc-section="${CSS.escape(sectionId)}"]`);
  if (!section) {
    return null;
  }

  if (highlightedSection) {
    highlightedSection.classList.remove(SECTION_HIGHLIGHT_CLASS);
  }

  section.classList.add(SECTION_HIGHLIGHT_CLASS);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  highlightedSection = section;
  return section;
}

function handleDocSectionFocus(event) {
  const args = event.detail?.args ?? {};
  const sectionId = args.sectionId;

  if (!sectionId) {
    const errorMessage = 'sectionId is required to focus a documentation section.';
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_SECTION_FOCUS, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SECTION_FOCUS);
    event.preventDefault();
    return;
  }

  const section = focusDocSection(sectionId);

  if (!section) {
    const errorMessage = `Documentation section not found for id "${sectionId}".`;
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_SECTION_FOCUS, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SECTION_FOCUS);
    event.preventDefault();
    return;
  }

  const successMessage = `Focused documentation section "${sectionId}".`;
  setTrainingStatus(successMessage, 'info');
  dispatchSuccess(TOOL_SECTION_FOCUS, { sectionId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_SECTION_FOCUS);
  event.preventDefault();
}

function handlePlaybookExpand(event) {
  const args = event.detail?.args ?? {};
  const playbookId = args.playbookId;

  if (!playbookId) {
    const errorMessage = 'playbookId is required to expand a playbook entry.';
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_PLAYBOOK_EXPAND, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_PLAYBOOK_EXPAND);
    event.preventDefault();
    return;
  }

  const entry = document.querySelector(`[data-playbook-id="${CSS.escape(playbookId)}"]`);

  if (!entry) {
    const errorMessage = `Playbook item not found for id "${playbookId}".`;
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_PLAYBOOK_EXPAND, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_PLAYBOOK_EXPAND);
    event.preventDefault();
    return;
  }

  entry.open = true;
  entry.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const successMessage = `Expanded playbook "${playbookId}".`;
  setTrainingStatus(successMessage, 'info');
  dispatchSuccess(TOOL_PLAYBOOK_EXPAND, { playbookId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_PLAYBOOK_EXPAND);
  event.preventDefault();
}

function getTrainingElements() {
  return {
    form: document.getElementById('training-request-form'),
    name: document.getElementById('training-name'),
    email: document.getElementById('training-email'),
    focusArea: document.getElementById('training-focus-area')
  };
}

function handleTrainingRequestFill(event) {
  const args = event.detail?.args ?? {};
  const elements = getTrainingElements();
  const missingElements = Object.entries(elements)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missingElements.length) {
    const errorMessage = `Training form elements missing: ${missingElements.join(', ')}`;
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_TRAINING_FILL, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_TRAINING_FILL);
    event.preventDefault();
    return;
  }

  const results = {
    name: args.name ? fillFormField(elements.name, args.name) : false,
    email: args.email ? fillFormField(elements.email, args.email) : false,
    focusArea: args.focusArea ? fillFormField(elements.focusArea, args.focusArea) : false
  };

  const requiredSatisfied = Boolean(results.name && results.email && results.focusArea);

  if (!requiredSatisfied) {
    const errorMessage = 'name, email, and focusArea are required for the training request.';
    setTrainingStatus(errorMessage, 'error');
    dispatchError(TOOL_TRAINING_FILL, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_TRAINING_FILL);
    event.preventDefault();
    return;
  }

  setTrainingStatus('Training request form populated.', 'success');
  dispatchSuccess(TOOL_TRAINING_FILL, { filled: results });
  log('Training request form filled successfully', 'success');
  updateLastEvent(TOOL_TRAINING_FILL);

  if (args.submit) {
    submitTrainingForm(elements.form);
  }

  event.preventDefault();
}

function submitTrainingForm(form) {
  if (!form) {
    return;
  }

  const payload = new FormData(form);
  log(`Training request submitted: ${JSON.stringify(Object.fromEntries(payload.entries()))}`, 'info');
  setTrainingStatus('Training request submitted. Expect a reply shortly!', 'success');
  dispatchSuccess(TOOL_TRAINING_FILL, { submitted: true });
  form.reset();
}

function registerUserTrainingHandlers() {
  const { form } = getTrainingElements();
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitTrainingForm(form);
  });
}

let userHandlersRegistered = false;

export function registerDocsTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_SECTION_FOCUS, handleDocSectionFocus);
    target.addEventListener(TOOL_PLAYBOOK_EXPAND, handlePlaybookExpand);
    target.addEventListener(TOOL_TRAINING_FILL, handleTrainingRequestFill);
  });

  if (!userHandlersRegistered) {
    registerUserTrainingHandlers();
    userHandlersRegistered = true;
  }

  return () => {
    if (highlightedSection) {
      highlightedSection.classList.remove(SECTION_HIGHLIGHT_CLASS);
      highlightedSection = null;
    }

    targets.forEach((target) => {
      target.removeEventListener(TOOL_SECTION_FOCUS, handleDocSectionFocus);
      target.removeEventListener(TOOL_PLAYBOOK_EXPAND, handlePlaybookExpand);
      target.removeEventListener(TOOL_TRAINING_FILL, handleTrainingRequestFill);
    });
  };
}

