const KPI_METRICS = [
  { label: 'Agent-driven conversions', value: '128', delta: '+18%' },
  { label: 'Avg. handle time', value: '3m 42s', delta: '-12%' },
  { label: 'Customer satisfaction', value: '4.7 / 5', delta: '+0.3' }
];

export function KpiDeck() {
  return (
    <section className="card analytics-kpis" id="analytics-kpis">
      <h2>Key Metrics</h2>
      <div className="kpi-grid">
        {KPI_METRICS.map((metric) => (
          <article key={metric.label} className="kpi-card">
            <span className="kpi-label">{metric.label}</span>
            <span className="kpi-value">{metric.value}</span>
            <span className="kpi-delta">{metric.delta}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

