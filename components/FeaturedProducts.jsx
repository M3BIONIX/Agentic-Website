const FEATURED_PRODUCTS = [
  {
    id: 'agent-studio',
    title: 'Agent Studio',
    description: 'Visual designer for crafting guided agent flows and observability dashboards.',
    metrics: ['Setup in 15 minutes', 'Security-hardened'],
    highlight: 'Popular'
  },
  {
    id: 'human-handoff',
    title: 'Human Handoff Playbook',
    description: 'Bring humans into the loop with automatic routing, transcripts, and action history.',
    metrics: ['Works with Zendesk', 'No-code routing'],
    highlight: 'New'
  },
  {
    id: 'toolkit-sdk',
    title: 'Toolkit SDK',
    description: 'Ship page-scoped tools with typed manifests and analytics instrumentation.',
    metrics: ['Typed schema', 'Telemetry ready'],
    highlight: 'Developer Favorite'
  }
];

export function FeaturedProducts() {
  return (
    <section className="card stacked" id="featured-products">
      <header className="section-heading">
        <div>
          <h2>Featured Agent Flows</h2>
          <p>
            Each card exposes a stable identifier the agent can focus via the <code>featured_product_highlight</code>{' '}
            tool. Use this to bring the right capability into view before triggering a task.
          </p>
        </div>
      </header>

      <div className="product-grid">
        {FEATURED_PRODUCTS.map((product) => (
          <article
            key={product.id}
            id={`product-${product.id}`}
            data-product-id={product.id}
            className="product-card"
          >
            <div className="product-meta">
              <span className="product-badge">{product.highlight}</span>
            </div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <ul className="product-metrics">
              {product.metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

