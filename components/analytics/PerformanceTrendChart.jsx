const TREND_POINTS = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 60 },
  { label: 'Wed', value: 55 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 64 }
];

export function PerformanceTrendChart() {
  return (
    <section className="card analytics-chart" id="analytics-trend">
      <h2>Engagement Trend</h2>
      <div className="chart-grid">
        {TREND_POINTS.map((point) => (
          <div key={point.label} className="chart-column">
            <div className="chart-bar" style={{ height: `${point.value + 30}px` }} />
            <span className="chart-label">{point.label}</span>
          </div>
        ))}
      </div>
      <p className="chart-footnote">Volume normalised across agent and human-assisted sessions.</p>
    </section>
  );
}

