import Head from 'next/head';
import Script from 'next/script';
import { KpiDeck } from '@/components/analytics/KpiDeck';
import { PerformanceTrendChart } from '@/components/analytics/PerformanceTrendChart';
import { SessionTable } from '@/components/analytics/SessionTable';
import { FilterPanel } from '@/components/analytics/FilterPanel';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics Dashboard | Agent-Ready Experience</title>
        <meta
          name="description"
          content="Review KPIs, filter agent sessions, and export insights. Tools keep analytics actions scoped to this page."
        />
      </Head>

      <main>
        <section className="page-header">
          <h1>Agent Analytics</h1>
          <p>
            Blend real-time performance indicators with filtered session views. Agents can adjust filters, focus a
            timeline row, and export insights for reporting workflows.
          </p>
        </section>

        <div className="grid">
          <KpiDeck />
          <FilterPanel />
        </div>

        <div className="grid">
          <PerformanceTrendChart />
          <SessionTable />
        </div>

        <AgentStatusPanel />
      </main>

      <footer className="footer">
        Continue into documentation or the support workspace using the exposed routes.
      </footer>

      <Script src="/js/tools/analytics.tools.js" strategy="afterInteractive" type="module" />
    </>
  );
}

