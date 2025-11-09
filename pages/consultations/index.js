import Head from 'next/head';
import Script from 'next/script';
import { ConsultationOverview } from '@/components/consultations/ConsultationOverview';
import { AvailabilityCalendar } from '@/components/consultations/AvailabilityCalendar';
import { FaqAccordion } from '@/components/consultations/FaqAccordion';
import { ConsultationForm } from '@/components/consultations/ConsultationForm';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';

export default function ConsultationPage() {
  return (
    <>
      <Head>
        <title>Consultation Booking | Agent-Ready Experience</title>
        <meta
          name="description"
          content="Schedule strategic consultation sessions, explore availability, and let agents fill the booking form with scoped tools."
        />
      </Head>

      <main>
        <section className="page-header">
          <h1>Consultation Booking</h1>
          <p>
            Let your agent gather key context, surface FAQs, and reserve time with a solutions architect. Tools are
            scoped to this page so the manifest stays focused.
          </p>
        </section>

        <div className="grid">
          <ConsultationOverview />
          <AvailabilityCalendar />
        </div>

        <div className="grid">
          <ConsultationForm />
          <FaqAccordion />
        </div>

        <AgentStatusPanel />
      </main>

      <footer className="footer">
        Continue exploring analytics, documentation, and the support workspace via the available navigation tools.
      </footer>

      <Script src="/js/tools/consultations.tools.js" strategy="afterInteractive" type="module" />
    </>
  );
}

