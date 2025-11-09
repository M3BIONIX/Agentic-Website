const RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'quarter', label: 'This quarter' }
];

const AGENT_TYPES = [
  { value: 'all', label: 'All agents' },
  { value: 'sales', label: 'Sales concierge' },
  { value: 'support', label: 'Support assistant' },
  { value: 'onboarding', label: 'Onboarding guide' }
];

export function FilterPanel() {
  return (
    <section className="card analytics-filters" id="analytics-filters">
      <h2>Filter Sessions</h2>
      <form id="analytics-filter-form">
        <div className="form-row">
          <div>
            <label htmlFor="analytics-range">Time range</label>
            <select id="analytics-range" name="analytics-range" defaultValue="7d">
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="analytics-agent-type">Agent type</label>
            <select id="analytics-agent-type" name="analytics-agent-type" defaultValue="all">
              {AGENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="toggle" htmlFor="analytics-success-only">
            <input type="checkbox" id="analytics-success-only" name="analytics-success-only" />
            Show successful sessions only
          </label>
        </div>
      </form>
      <div id="analytics-status" className="status info" aria-live="polite">
        Showing last 7 days across all agent personas.
      </div>
      <button type="button" id="analytics-export">
        Export insights
      </button>
    </section>
  );
}

