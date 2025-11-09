import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';
import { updateLastEvent } from '../ui/status.js';

const TOOL_FILTER_APPLY = 'dashboard_filter_apply';
const TOOL_SESSION_FOCUS = 'session_detail_focus';
const TOOL_EXPORT = 'export_insights';

const RANGE_LABELS = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  quarter: 'this quarter'
};

const AGENT_LABELS = {
  all: 'all agent personas',
  sales: 'sales concierge',
  support: 'support assistant',
  onboarding: 'onboarding guide'
};

let highlightedSession = null;

function setAnalyticsStatus(message, type = 'info') {
  const statusEl = document.getElementById('analytics-status');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function getFilterElements() {
  return {
    range: document.getElementById('analytics-range'),
    agentType: document.getElementById('analytics-agent-type'),
    successOnly: document.getElementById('analytics-success-only')
  };
}

function getSessionRows() {
  return Array.from(document.querySelectorAll('[data-session-id]'));
}

function applySuccessFilter(successOnly) {
  getSessionRows().forEach((row) => {
    const outcome = row.dataset.outcome;
    const shouldHide = successOnly && outcome !== 'success';
    row.classList.toggle('hidden', shouldHide);
  });
}

function resolveLabel(map, key, fallback) {
  if (!key) {
    return fallback;
  }
  return map[key] ?? fallback;
}

function handleDashboardFilterApply(event) {
  const args = event.detail?.args ?? {};
  const elements = getFilterElements();
  const missingElements = Object.entries(elements)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missingElements.length) {
    const errorMessage = `Analytics filter elements missing: ${missingElements.join(', ')}`;
    setAnalyticsStatus(errorMessage, 'error');
    dispatchError(TOOL_FILTER_APPLY, errorMessage);
    log(errorMessage, 'error');
    updateLastEvent(TOOL_FILTER_APPLY);
    event.preventDefault();
    return;
  }

  const rangeValue = args.range ?? elements.range.value;
  const agentValue = args.agentType ?? elements.agentType.value;
  const successOnly = typeof args.successOnly === 'boolean' ? args.successOnly : elements.successOnly.checked;

  if (rangeValue) {
    elements.range.value = rangeValue;
  }

  if (agentValue) {
    elements.agentType.value = agentValue;
  }

  elements.successOnly.checked = Boolean(successOnly);
  applySuccessFilter(elements.successOnly.checked);

  const summary = `Showing ${resolveLabel(RANGE_LABELS, elements.range.value, 'recent activity')} for ${resolveLabel(
    AGENT_LABELS,
    elements.agentType.value,
    'all personas'
  )}${elements.successOnly.checked ? ' (success only)' : ''}.`;

  setAnalyticsStatus(summary, 'info');
  dispatchSuccess(TOOL_FILTER_APPLY, {
    range: elements.range.value,
    agentType: elements.agentType.value,
    successOnly: elements.successOnly.checked
  });
  log(`Analytics filters applied: ${summary}`, 'success');
  updateLastEvent(TOOL_FILTER_APPLY);
  event.preventDefault();
}

function clearSessionHighlight() {
  if (!highlightedSession) {
    return;
  }
  highlightedSession.classList.remove('session-focus');
  highlightedSession = null;
}

function handleSessionDetailFocus(event) {
  const args = event.detail?.args ?? {};
  const sessionId = args.sessionId;

  if (!sessionId) {
    const errorMessage = 'sessionId is required to focus a session row.';
    setAnalyticsStatus(errorMessage, 'error');
    dispatchError(TOOL_SESSION_FOCUS, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SESSION_FOCUS);
    event.preventDefault();
    return;
  }

  const row = document.querySelector(`[data-session-id="${CSS.escape(sessionId)}"]`);

  if (!row) {
    const errorMessage = `Session not found for id "${sessionId}".`;
    setAnalyticsStatus(errorMessage, 'error');
    dispatchError(TOOL_SESSION_FOCUS, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_SESSION_FOCUS);
    event.preventDefault();
    return;
  }

  clearSessionHighlight();
  row.classList.remove('hidden');
  row.classList.add('session-focus');
  highlightedSession = row;
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const successMessage = `Focused analytics session ${sessionId}.`;
  setAnalyticsStatus(successMessage, 'success');
  dispatchSuccess(TOOL_SESSION_FOCUS, { sessionId });
  log(successMessage, 'success');
  updateLastEvent(TOOL_SESSION_FOCUS);
  event.preventDefault();
}

function serializeInsights() {
  const elements = getFilterElements();
  const activeRows = getSessionRows().filter((row) => !row.classList.contains('hidden'));

  return {
    filters: {
      range: elements.range?.value ?? null,
      agentType: elements.agentType?.value ?? null,
      successOnly: elements.successOnly?.checked ?? false
    },
    sessions: activeRows.map((row) => ({
      id: row.dataset.sessionId,
      customer: row.children[1]?.textContent ?? '',
      intent: row.children[2]?.textContent ?? '',
      outcome: row.dataset.outcome
    }))
  };
}

async function copyInsightsToClipboard(payload) {
  if (!navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    return true;
  } catch {
    return false;
  }
}

function triggerDownload(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'agent-analytics.json';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function handleExportInsights(event) {
  const payload = serializeInsights();
  const copied = await copyInsightsToClipboard(payload);

  if (!copied) {
    triggerDownload(payload);
  }

  setAnalyticsStatus('Insights ready for sharing. Clipboard or download generated.', 'success');
  dispatchSuccess(TOOL_EXPORT, { copied });
  log('Analytics insights exported.', 'success');
  updateLastEvent(TOOL_EXPORT);
  event.preventDefault();
}

function registerUserFilterHandlers() {
  const form = document.getElementById('analytics-filter-form');
  if (!form) {
    return;
  }

  form.addEventListener('change', () => {
    handleDashboardFilterApply(new CustomEvent(TOOL_FILTER_APPLY, { detail: { args: {} } }));
  });

  const exportBtn = document.getElementById('analytics-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', (clickEvent) => {
      handleExportInsights(clickEvent);
    });
  }
}

let userHandlersRegistered = false;

export function registerAnalyticsTools() {
  const targets = [document, window];

  targets.forEach((target) => {
    target.addEventListener(TOOL_FILTER_APPLY, handleDashboardFilterApply);
    target.addEventListener(TOOL_SESSION_FOCUS, handleSessionDetailFocus);
    target.addEventListener(TOOL_EXPORT, handleExportInsights);
  });

  if (!userHandlersRegistered) {
    registerUserFilterHandlers();
    userHandlersRegistered = true;
  }

  return () => {
    clearSessionHighlight();
    targets.forEach((target) => {
      target.removeEventListener(TOOL_FILTER_APPLY, handleDashboardFilterApply);
      target.removeEventListener(TOOL_SESSION_FOCUS, handleSessionDetailFocus);
      target.removeEventListener(TOOL_EXPORT, handleExportInsights);
    });
  };
}

