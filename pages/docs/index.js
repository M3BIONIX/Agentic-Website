import Head from 'next/head';
import Script from 'next/script';
import { DocSidebar } from '@/components/docs/DocSidebar';
import { DocContent } from '@/components/docs/DocContent';
import { PlaybookAccordion } from '@/components/docs/PlaybookAccordion';
import { GlossaryPopover } from '@/components/docs/GlossaryPopover';
import { TrainingCTA } from '@/components/docs/TrainingCTA';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';

export default function DocsPage() {
  return (
    <>
      <Head>
        <title>Knowledge Base | Agent-Ready Experience</title>
        <meta
          name="description"
          content="Explore documentation, playbooks, and glossary entries. Agents can focus sections, open playbooks, and request training."
        />
      </Head>

      <main>
        <section className="page-header">
          <h1>Knowledge Base & Playbooks</h1>
          <p>
            Reference architecture decisions, operational playbooks, and key vocabulary. Agents keep context local by
            calling page-scoped tools.
          </p>
        </section>

        <div className="docs-layout">
          <DocSidebar />
          <DocContent />
        </div>

        <div className="grid">
          <PlaybookAccordion />
          <GlossaryPopover />
        </div>

        <TrainingCTA />

        <AgentStatusPanel />
      </main>

      <footer className="footer">
        Ready to act? Navigate to support or consultations using the exposed routes.
      </footer>

      <Script src="/js/tools/docs.tools.js" strategy="afterInteractive" type="module" />
    </>
  );
}

