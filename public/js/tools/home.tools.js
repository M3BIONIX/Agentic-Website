import { initAgent } from '../agentic-handler.js';
import { registerContactTools } from '../modules/contact-tools.js';
import { registerProductTools } from '../modules/product-tools.js';
import { registerCartTools } from '../modules/cart-tools.js';
import { registerHomePageTools } from '../modules/home-page-tools.js';
import { registerNavigationTools, updateNavigationRoutes } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';
import { setStatus } from '../ui/status.js';

const MANIFEST_URL = '/manifests/home.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load home manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapHomeAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'home',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools, registerContactTools, registerProductTools, registerCartTools, registerHomePageTools]
    });
    updateNavigationRoutes(manifest.navigation?.routes ?? []);
  } catch (error) {
    log(`Home agent bootstrap failed: ${error.message}`, 'error');
    setStatus('Agent tools failed to initialize on home page', 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapHomeAgent);
} else {
  bootstrapHomeAgent();
}

