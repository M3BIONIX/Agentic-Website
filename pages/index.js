import Head from 'next/head';
import Script from 'next/script';
import { HeroShowcase } from '@/components/HeroShowcase';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ContactSection } from '@/components/ContactSection';
import { ProductSearchSection } from '@/components/ProductSearchSection';
import { CartSection } from '@/components/CartSection';
import { QuickCTA } from '@/components/QuickCTA';
import { AgentStatusPanel } from '@/components/AgentStatusPanel';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Agent-Ready Commerce Experience</title>
        <meta
          name="description"
          content="A Next.js storefront template showcasing scoped agent tools for commerce, consultations, analytics, documentation, and support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeroShowcase />
        <FeaturedProducts />

        <div className="grid">
          <ProductSearchSection />
          <QuickCTA />
        </div>

        <div className="grid stacked-grid">
          <ContactSection />
          <CartSection />
        </div>

        <AgentStatusPanel />
      </main>

      <footer className="footer">
        Built with Next.js, ready for static export and XAMPP deployment.
      </footer>

      <Script src="/js/tools/home.tools.js" strategy="afterInteractive" type="module" />
    </>
  );
}

