import { initAgent } from '../agentic-handler.js';
import { registerDocsTools } from '../modules/docs-tools.js';
import { registerNavigationTools } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';

const MANIFEST_URL = '/manifests/docs.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load docs manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapDocsAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'docs',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools, registerDocsTools]
    });
  } catch (error) {
    log(`Docs agent bootstrap failed: ${error.message}`, 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapDocsAgent);
} else {
  bootstrapDocsAgent();
}

