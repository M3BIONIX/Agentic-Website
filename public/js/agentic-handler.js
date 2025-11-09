import { CONFIG } from './config.js';
import { setStatus } from './ui/status.js';
import { log } from './utils/logger.js';

const GENERIC_AGENT_EVENT = CONFIG.eventNamespace ? `${CONFIG.eventNamespace}-action` : 'ai-agent-action';

const MANIFEST_DIRECTORY_URL = '/.well-known/llms.txt';

const runtimeState = {
  activePageId: null,
  teardownCallbacks: [],
  genericHandlerRegistered: false,
  manifestDirectoryPromise: null,
  manifestDirectory: null,
  processedPages: new Set(),
  toolPageMap: new Map(),
  guardListeners: new Map(),
  allMappingsHydrated: false,
  hydratePromise: null,
  navigationLock: false
};

function registerGenericAgentListener() {
  if (runtimeState.genericHandlerRegistered) {
    return;
  }

  const handler = (event) => {
    try {
      log(`Generic agent action received: ${JSON.stringify(event.detail)}`, 'info');
    } catch (error) {
      log(`Generic agent action received (unserializable detail): ${error.message}`, 'warning');
    }
  };

  runtimeState.genericHandlerRegistered = true;
  runtimeState.genericHandler = handler;

  [document, window].forEach((target) => {
    target.addEventListener(GENERIC_AGENT_EVENT, handler);
  });
}

function pageIdToPath(pageId) {
  if (!pageId || pageId === 'home') {
    return '/';
  }

  const cleaned = String(pageId).replace(/^\/|\/$/g, '');
  return `/${cleaned}/`;
}

function registerGuard(toolName) {
  if (!toolName || runtimeState.guardListeners.has(toolName)) {
    return;
  }

  const listener = (event) => {
    const targetPageId = runtimeState.toolPageMap.get(toolName);

    if (!targetPageId || targetPageId === runtimeState.activePageId || runtimeState.navigationLock) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    runtimeState.navigationLock = true;

    const targetPath = pageIdToPath(targetPageId);
    log(`Intercepted ${toolName} on ${runtimeState.activePageId}. Navigating to ${targetPageId}.`, 'info');

    window.setTimeout(() => {
      window.location.assign(targetPath);
      runtimeState.navigationLock = false;
    }, 0);
  };

  document.addEventListener(toolName, listener, true);
  window.addEventListener(toolName, listener, true);
  runtimeState.guardListeners.set(toolName, listener);
}

async function loadManifestDirectory() {
  if (runtimeState.manifestDirectory) {
    return runtimeState.manifestDirectory;
  }

  if (!runtimeState.manifestDirectoryPromise) {
    runtimeState.manifestDirectoryPromise = fetch(MANIFEST_DIRECTORY_URL, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load llms directory: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        runtimeState.manifestDirectory = data;
        return data;
      })
      .catch((error) => {
        log(`Unable to load manifest directory: ${error.message}`, 'warning');
        runtimeState.manifestDirectoryPromise = null;
        return null;
      });
  }

  return runtimeState.manifestDirectoryPromise;
}

function registerToolMetadata({ pageId, tools }) {
  if (!pageId || !Array.isArray(tools)) {
    return;
  }

  runtimeState.processedPages.add(pageId);

  tools.forEach((tool) => {
    if (!tool?.name) {
      return;
    }
    runtimeState.toolPageMap.set(tool.name, pageId);
    registerGuard(tool.name);
  });
}

async function hydrateAllToolMappings() {
  if (runtimeState.allMappingsHydrated || runtimeState.hydratePromise) {
    return runtimeState.hydratePromise;
  }

  runtimeState.hydratePromise = (async () => {
    const directory = await loadManifestDirectory();
    if (!directory?.routes?.length) {
      return;
    }

    await Promise.all(
      directory.routes.map(async (route) => {
        if (!route?.pageId || runtimeState.processedPages.has(route.pageId) || !route.manifestUrl) {
          return;
        }

        try {
          const response = await fetch(route.manifestUrl, { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(`Manifest fetch failed (${response.status})`);
          }
          const manifest = await response.json();
          registerToolMetadata({ pageId: route.pageId, tools: manifest?.tools ?? [] });
        } catch (error) {
          log(`Failed to hydrate manifest for ${route.pageId}: ${error.message}`, 'warning');
        }
      })
    );

    runtimeState.allMappingsHydrated = true;
  })();

  return runtimeState.hydratePromise;
}

function normalizeBindings(bindings = []) {
  if (!Array.isArray(bindings)) {
    return [];
  }

  return bindings.filter((binding) => typeof binding === 'function');
}

/**
 * Initialize agent tools for the provided page definition.
 * @param {object} config
 * @param {string} config.pageId
 * @param {string} [config.title]
 * @param {string} [config.description]
 * @param {Array<string>} [config.routes]
 * @param {Array<object>} [config.tools]
 * @param {Array<Function>} [config.bindings]
 */
export async function initAgent(config) {
  const { pageId, title = null, description = null, routes = [], tools = [], bindings = [] } = config ?? {};

  if (!pageId) {
    throw new Error('initAgent requires a pageId');
  }

  if (runtimeState.activePageId && runtimeState.activePageId !== pageId) {
    await teardownAgent();
  }

  registerGenericAgentListener();

  registerToolMetadata({ pageId, tools });
  hydrateAllToolMappings();

  runtimeState.activePageId = pageId;
  runtimeState.teardownCallbacks = [];

  const normalizedBindings = normalizeBindings(bindings);

  normalizedBindings.forEach((binding) => {
    try {
      const teardown = binding();
      if (typeof teardown === 'function') {
        runtimeState.teardownCallbacks.push(teardown);
      }
    } catch (error) {
      log(`Failed to register binding for ${pageId}: ${error.message}`, 'error');
    }
  });

  setStatus(`Agent tools ready for ${pageId}`, 'success');
  log(`Agent initialized for ${pageId}`, 'success');
}

export async function teardownAgent() {
  if (!runtimeState.activePageId && runtimeState.teardownCallbacks.length === 0) {
    return;
  }

  log(`Tearing down agent for ${runtimeState.activePageId}`, 'info');

  runtimeState.teardownCallbacks.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      log(`Error during teardown: ${error.message}`, 'warning');
    }
  });

  runtimeState.teardownCallbacks = [];
  runtimeState.activePageId = null;
}

export function getActivePageId() {
  return runtimeState.activePageId;
}

if (typeof window !== 'undefined') {
  window.AgenticHandler = {
    initAgent,
    teardownAgent,
    getActivePageId
  };
}

