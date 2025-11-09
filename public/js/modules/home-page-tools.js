import { setStatus, updateLastEvent } from '../ui/status.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';

const TOOL_HIGHLIGHT = 'featured_product_highlight';
const TOOL_QUICK_CONTACT_SUBMIT = 'quick_contact_fill_submit';
const TOOL_QUICK_CONTACT_FILL = 'quick_contact_fill';
const HIGHLIGHT_CLASS = 'product-card--focus';

let highlightedElement = null;

function getProductCard(productId) {
  if (!productId) {
    return null;
  }

  try {
    return document.querySelector(`[data-product-id="${CSS.escape(productId)}"]`);
  } catch {
    return document.getElementById(`product-${productId}`);
  }
}

function clearHighlight() {
  if (!highlightedElement) {
    return;
  }

  highlightedElement.classList.remove(HIGHLIGHT_CLASS);
  highlightedElement = null;
}

function highlightProductCard(productId) {
  const card = getProductCard(productId);
  if (!card) {
    return false;
  }

  clearHighlight();
  card.classList.add(HIGHLIGHT_CLASS);
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  highlightedElement = card;
  return true;
}

function handleFeaturedProductHighlight(event) {
  const args = event.detail?.args ?? {};
  const productId = args.productId;

  if (!productId) {
    const errorMessage = 'productId is required to highlight a featured product';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_HIGHLIGHT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_HIGHLIGHT);
    event.preventDefault();
    return;
  }

  const highlighted = highlightProductCard(productId);

  if (!highlighted) {
    const errorMessage = `No featured product found for id "${productId}"`;
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_HIGHLIGHT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_HIGHLIGHT);
    event.preventDefault();
    return;
  }

  const successMessage = `Highlighted featured product ${productId}`;
  setStatus(successMessage, 'success');
  dispatchSuccess(TOOL_HIGHLIGHT, { productId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_HIGHLIGHT);
  event.preventDefault();
}

function broadcastToolEvent(eventName, detail) {
  [window, document].forEach((target) => {
    target.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true
      })
    );
  });
}

function dispatchContactFill(args) {
  broadcastToolEvent('contact_form_fill', { args });
}

function dispatchContactSubmit() {
  broadcastToolEvent('contact_form_submit', { args: {} });
}

function handleQuickContactFill(event) {
  const args = event.detail?.args ?? {};
  const { name, email, message } = args;

  if (!name || !email) {
    const errorMessage = 'name and email are required for quick contact';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_QUICK_CONTACT_FILL, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_QUICK_CONTACT_FILL);
    event.preventDefault();
    return;
  }

  dispatchContactFill({ name, email, message });

  const successMessage = 'Quick contact form populated';
  setStatus(successMessage, 'success');
  dispatchSuccess(TOOL_QUICK_CONTACT_FILL, { filled: true });
  log(successMessage, 'success');
  updateLastEvent(TOOL_QUICK_CONTACT_FILL);
  event.preventDefault();
}

function handleQuickContactFillSubmit(event) {
  const args = event.detail?.args ?? {};
  const { name, email, message } = args;

  if (!name || !email) {
    const errorMessage = 'name and email are required for quick contact';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_QUICK_CONTACT_SUBMIT, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_QUICK_CONTACT_SUBMIT);
    event.preventDefault();
    return;
  }

  dispatchContactFill({ name, email, message });
  dispatchContactSubmit();

  const successMessage = 'Quick contact form filled and submitted';
  setStatus(successMessage, 'success');
  dispatchSuccess(TOOL_QUICK_CONTACT_SUBMIT, { submitted: true });
  log(successMessage, 'success');
  updateLastEvent(TOOL_QUICK_CONTACT_SUBMIT);
  event.preventDefault();
}

export function registerHomePageTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_HIGHLIGHT, handleFeaturedProductHighlight);
    target.addEventListener(TOOL_QUICK_CONTACT_FILL, handleQuickContactFill);
    target.addEventListener(TOOL_QUICK_CONTACT_SUBMIT, handleQuickContactFillSubmit);
  });

  return () => {
    clearHighlight();
    targets.forEach((target) => {
      target.removeEventListener(TOOL_HIGHLIGHT, handleFeaturedProductHighlight);
      target.removeEventListener(TOOL_QUICK_CONTACT_FILL, handleQuickContactFill);
      target.removeEventListener(TOOL_QUICK_CONTACT_SUBMIT, handleQuickContactFillSubmit);
    });
  };
}

