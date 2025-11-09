import Head from 'next/head';
import Script from 'next/script';
import { TicketList } from '@/components/support/TicketList';
import { TicketDetail } from '@/components/support/TicketDetail';
import { TemplateSelect } from '@/components/support/TemplateSelect';
import { ResolutionChecklist } from '@/components/support/ResolutionChecklist';
import { EscalationBanner } from '@/components/support/EscalationBanner';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support Workspace | Agent-Ready Experience</title>
        <meta
          name="description"
          content="Manage customer tickets with agent assistance. Select tickets, compose responses, and track resolution checklists."
        />
      </Head>

      <main>
        <section className="page-header">
          <h1>Support Workspace</h1>
          <p>
            Agents can triage tickets, draft responses, and track resolution steps. Each tool keeps interactions scoped
            to this workspace.
          </p>
        </section>

        <div className="support-layout">
          <TicketList />
          <TicketDetail />
        </div>

        <div className="grid">
          <TemplateSelect />
          <ResolutionChecklist />
        </div>

        <EscalationBanner />

        <AgentStatusPanel />
      </main>

      <footer className="footer">
        Jump back to analytics or documentation to keep the loop tight.
      </footer>

      <Script src="/js/tools/support.tools.js" strategy="afterInteractive" type="module" />
    </>
  );
}

