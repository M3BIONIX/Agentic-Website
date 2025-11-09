import { fillFormField } from '../utils/forms.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';
import { updateLastEvent } from '../ui/status.js';

const TOOL_TICKET_SELECT = 'ticket_select';
const TOOL_RESPONSE_SEND = 'response_compose_send';
const TOOL_CHECKLIST_UPDATE = 'resolution_checklist_update';

const statusId = 'support-status';

let activeTicketId = null;

function setSupportStatus(message, type = 'info') {
  const statusEl = document.getElementById(statusId);
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function getTicketElements() {
  return Array.from(document.querySelectorAll('[data-ticket-id]'));
}

function updateTicketSelection(ticketElement) {
  getTicketElements().forEach((item) => item.classList.remove('ticket-selected'));
  if (ticketElement) {
    ticketElement.classList.add('ticket-selected');
    activeTicketId = ticketElement.dataset.ticketId;
  } else {
    activeTicketId = null;
  }
}

function updateTicketSummary(ticketElement) {
  const summary = document.getElementById('support-ticket-summary');
  if (!summary || !ticketElement) {
    return;
  }

  const customer = ticketElement.dataset.ticketCustomer;
  const subject = ticketElement.dataset.ticketSubject;
  summary.textContent = `${customer}: ${subject}`;
}

function handleTicketSelect(event) {
  const args = event.detail?.args ?? {};
  const ticketId = args.ticketId;

  if (!ticketId) {
    const errorMessage = 'ticketId is required to select a ticket.';
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_TICKET_SELECT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_TICKET_SELECT);
    event.preventDefault();
    return;
  }

  const ticketElement = document.querySelector(`[data-ticket-id="${CSS.escape(ticketId)}"]`);

  if (!ticketElement) {
    const errorMessage = `Ticket not found for id "${ticketId}".`;
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_TICKET_SELECT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_TICKET_SELECT);
    event.preventDefault();
    return;
  }

  updateTicketSelection(ticketElement);
  updateTicketSummary(ticketElement);

  const successMessage = `Ticket ${ticketId} selected.`;
  setSupportStatus(successMessage, 'info');
  dispatchSuccess(TOOL_TICKET_SELECT, { ticketId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_TICKET_SELECT);
  event.preventDefault();
}

function getResponseElements() {
  return {
    form: document.getElementById('support-response-form'),
    template: document.getElementById('support-template-select'),
    message: document.getElementById('support-response-message')
  };
}

function simulateResponseSend(ticketId, templateId, message) {
  const payload = {
    ticketId,
    templateId,
    message,
    sentAt: new Date().toISOString()
  };

  log(`Support response sent: ${JSON.stringify(payload)}`, 'info');
}

function handleResponseComposeSend(event) {
  const args = event.detail?.args ?? {};
  const { ticketId = activeTicketId, templateId, message } = args;
  const elements = getResponseElements();

  if (!ticketId) {
    const errorMessage = 'ticketId is required before sending a response.';
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_RESPONSE_SEND, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_RESPONSE_SEND);
    event.preventDefault();
    return;
  }

  if (!elements.template || !elements.message) {
    const errorMessage = 'Response form elements missing.';
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_RESPONSE_SEND, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_RESPONSE_SEND);
    event.preventDefault();
    return;
  }

  if (templateId) {
    elements.template.value = templateId;
  }

  if (message) {
    fillFormField(elements.message, message);
  }

  if (!elements.message.value.trim()) {
    const errorMessage = 'Response message cannot be empty.';
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_RESPONSE_SEND, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_RESPONSE_SEND);
    event.preventDefault();
    return;
  }

  simulateResponseSend(ticketId, elements.template.value, elements.message.value);
  setSupportStatus(`Response sent to ${ticketId}`, 'success');
  dispatchSuccess(TOOL_RESPONSE_SEND, { ticketId, templateId: elements.template.value });
  updateLastEvent(TOOL_RESPONSE_SEND);

  elements.form?.reset();
  event.preventDefault();
}

function handleChecklistUpdate(event) {
  const args = event.detail?.args ?? {};
  const itemId = args.itemId;
  const completed = args.completed;

  if (!itemId || typeof completed !== 'boolean') {
    const errorMessage = 'itemId and completed flag are required to update checklist.';
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_CHECKLIST_UPDATE, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_CHECKLIST_UPDATE);
    event.preventDefault();
    return;
  }

  const checkbox = document.querySelector(`[data-checklist-id="${CSS.escape(itemId)}"]`);

  if (!checkbox) {
    const errorMessage = `Checklist item not found for id "${itemId}".`;
    setSupportStatus(errorMessage, 'error');
    dispatchError(TOOL_CHECKLIST_UPDATE, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_CHECKLIST_UPDATE);
    event.preventDefault();
    return;
  }

  checkbox.checked = completed;

  const successMessage = `Checklist "${itemId}" marked ${completed ? 'complete' : 'pending'}.`;
  setSupportStatus(successMessage, 'info');
  dispatchSuccess(TOOL_CHECKLIST_UPDATE, { itemId, completed });
  log(successMessage, 'success');
  updateLastEvent(TOOL_CHECKLIST_UPDATE);
  event.preventDefault();
}

function registerUserTicketHandlers() {
  getTicketElements().forEach((item) => {
    item.addEventListener('click', () => {
      handleTicketSelect(new CustomEvent(TOOL_TICKET_SELECT, { detail: { args: { ticketId: item.dataset.ticketId } } }));
    });
  });

  const elements = getResponseElements();
  if (elements.form) {
    elements.form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();
      handleResponseComposeSend(
        new CustomEvent(TOOL_RESPONSE_SEND, {
          detail: {
            args: {
              ticketId: activeTicketId,
              templateId: elements.template?.value,
              message: elements.message?.value
            }
          }
        })
      );
    });
  }

  const checkboxes = Array.from(document.querySelectorAll('[data-checklist-id]'));
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      handleChecklistUpdate(
        new CustomEvent(TOOL_CHECKLIST_UPDATE, {
          detail: {
            args: {
              itemId: checkbox.dataset.checklistId,
              completed: checkbox.checked
            }
          }
        })
      );
    });
  });
}

let userHandlersRegistered = false;

export function registerSupportTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_TICKET_SELECT, handleTicketSelect);
    target.addEventListener(TOOL_RESPONSE_SEND, handleResponseComposeSend);
    target.addEventListener(TOOL_CHECKLIST_UPDATE, handleChecklistUpdate);
  });

  if (!userHandlersRegistered) {
    registerUserTicketHandlers();
    userHandlersRegistered = true;
  }

  return () => {
    targets.forEach((target) => {
      target.removeEventListener(TOOL_TICKET_SELECT, handleTicketSelect);
      target.removeEventListener(TOOL_RESPONSE_SEND, handleResponseComposeSend);
      target.removeEventListener(TOOL_CHECKLIST_UPDATE, handleChecklistUpdate);
    });
  };
}

