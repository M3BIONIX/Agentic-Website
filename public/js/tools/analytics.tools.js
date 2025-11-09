import { initAgent } from '../agentic-handler.js';
import { registerAnalyticsTools } from '../modules/analytics-tools.js';
import { registerNavigationTools } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';

const MANIFEST_URL = '/manifests/analytics.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load analytics manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapAnalyticsAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'analytics',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools, registerAnalyticsTools]
    });
  } catch (error) {
    log(`Analytics agent bootstrap failed: ${error.message}`, 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapAnalyticsAgent);
} else {
  bootstrapAnalyticsAgent();
}

