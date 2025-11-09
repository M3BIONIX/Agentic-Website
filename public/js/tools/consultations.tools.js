import { initAgent } from '../agentic-handler.js';
import { registerConsultationTools } from '../modules/consultations-tools.js';
import { registerNavigationTools } from '../modules/navigation-tools.js';
import { log } from '../utils/logger.js';

const MANIFEST_URL = '/manifests/consultations.json';

async function fetchManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load consultations manifest: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function bootstrapConsultationAgent() {
  try {
    const manifest = await fetchManifest();

    await initAgent({
      pageId: manifest.pageId ?? 'consultations',
      title: manifest.title,
      description: manifest.description,
      routes: manifest.routes,
      tools: manifest.tools,
      bindings: [registerNavigationTools, registerConsultationTools]
    });
  } catch (error) {
    log(`Consultation agent bootstrap failed: ${error.message}`, 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapConsultationAgent);
} else {
  bootstrapConsultationAgent();
}

