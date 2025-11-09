import { fillFormField } from '../utils/forms.js';
import { setStatus, updateLastEvent } from '../ui/status.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';

const TOOL_SEARCH = 'product_search';
const SEARCH_TRIGGER_DELAY_MS = 100;

/**
 * Execute a product search when invoked by the agent.
 * @param {CustomEvent} event
 */
function handleProductSearch(event) {
  const args = event.detail?.args ?? {};
  const query = args.query ?? '';

  if (!query.trim()) {
    const errorMessage = 'Search query cannot be empty';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_SEARCH, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SEARCH);
    event.preventDefault();
    return;
  }

  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (!searchInput || !searchBtn) {
    const errorMessage = 'Search UI elements not found';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_SEARCH, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_SEARCH);
    event.preventDefault();
    return;
  }

  fillFormField(searchInput, query);

  window.setTimeout(() => {
    searchBtn.click();
    searchInput.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true
      })
    );
    log('Product search triggered via button click and Enter key', 'success');
  }, SEARCH_TRIGGER_DELAY_MS);

  const resultsEl = document.getElementById('search-results');
  if (resultsEl) {
    resultsEl.innerHTML = `<p>Searching for: "${query}"...</p>`;
  }

  setStatus(`Searching for: ${query}`, 'info');
  dispatchSuccess(TOOL_SEARCH, { query });
  updateLastEvent(TOOL_SEARCH);
  event.preventDefault();
}

/**
 * Register manual search handlers for local interactions.
 */
function registerUserSearchHandlers() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  if (!searchBtn || !searchInput) {
    return;
  }

  const performSearch = () => {
    const query = searchInput.value.trim();
    if (!query) {
      return;
    }

    log(`Performing search: ${query}`, 'info');
    if (resultsEl) {
      resultsEl.innerHTML = `<p>Search results for: "${query}"</p>`;
    }
  };

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      performSearch();
    }
  });
}

let userHandlersRegistered = false;

/**
 * Register product-search tool listeners.
 */
export function registerProductTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_SEARCH, handleProductSearch);
  });

  if (!userHandlersRegistered) {
    registerUserSearchHandlers();
    userHandlersRegistered = true;
  }

  return () => {
    targets.forEach((target) => {
      target.removeEventListener(TOOL_SEARCH, handleProductSearch);
    });
  };
}
