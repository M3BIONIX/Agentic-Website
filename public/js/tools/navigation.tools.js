import { initAgent } from '../agentic-handler.js';
import { registerNavigationTools, updateNavigationRoutes } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';

const MANIFEST_URL = '/manifests/navigation.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load navigation manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapNavigationAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'navigation',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools]
    });

    updateNavigationRoutes(
      manifest.routes?.map((pageId) => ({
        pageId,
        path: manifest.routePaths?.[pageId] ?? `/${pageId === 'home' ? '' : `${pageId}/`}`
      })) ?? []
    );
  } catch (error) {
    log(`Navigation agent bootstrap failed: ${error.message}`, 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapNavigationAgent);
} else {
  bootstrapNavigationAgent();
}

