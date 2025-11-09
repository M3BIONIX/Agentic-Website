import { dispatchError, dispatchSuccess } from '../utils/agent-events.js';
import { log } from '../utils/logger.js';

const TOOL_NAVIGATE = 'navigate_to_route';

const manifestRoutes = {};

export function updateNavigationRoutes(routes = []) {
  Object.keys(manifestRoutes).forEach((key) => {
    delete manifestRoutes[key];
  });

  routes.forEach((entry) => {
    if (!entry?.pageId || !entry?.path) {
      return;
    }
    manifestRoutes[entry.pageId] = entry.path;
  });
}

function normalizePath(path) {
  if (!path) {
    return null;
  }

  let normalized = String(path).trim();

  if (!normalized) {
    return null;
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

function resolveDestination(args = {}) {
  const { path, pageId } = args;

  if (path) {
    return normalizePath(path);
  }

  if (pageId && manifestRoutes[pageId]) {
    return manifestRoutes[pageId];
  }

  return null;
}

function handleNavigate(event) {
  const args = event.detail?.args ?? {};
  const destinationPath = resolveDestination(args);

  if (!destinationPath) {
    const errorMessage = 'A valid pageId or path is required to navigate.';
    dispatchError(TOOL_NAVIGATE, errorMessage);
    log(errorMessage, 'warning');
    event.preventDefault();
    return;
  }

  const targetUrl = new URL(destinationPath, window.location.origin);

  dispatchSuccess(TOOL_NAVIGATE, { destination: targetUrl.pathname });
  log(`Navigating to ${targetUrl.pathname}`, 'info');
  event.preventDefault();

  if (window.location.pathname === targetUrl.pathname && window.location.search === targetUrl.search) {
    log('Already on requested path; skipping navigation.', 'info');
    return;
  }

  try {
    window.location.assign(targetUrl.href);
  } catch (error) {
    log(`window.location.assign failed (${error.message}). Falling back to anchor navigation.`, 'warning');
    const anchor = document.createElement('a');
    anchor.href = targetUrl.href;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

export function registerNavigationTools() {
  const targets = [document, window];
  targets.forEach((target) => target.addEventListener(TOOL_NAVIGATE, handleNavigate));

  return () => {
    targets.forEach((target) => target.removeEventListener(TOOL_NAVIGATE, handleNavigate));
  };
}

