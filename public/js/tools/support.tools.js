import { initAgent } from '../agentic-handler.js';
import { registerSupportTools } from '../modules/support-tools.js';
import { registerNavigationTools } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';

const MANIFEST_URL = '/manifests/support.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load support manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapSupportAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'support',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools, registerSupportTools]
    });
  } catch (error) {
    log(`Support agent bootstrap failed: ${error.message}`, 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapSupportAgent);
} else {
  bootstrapSupportAgent();
}

