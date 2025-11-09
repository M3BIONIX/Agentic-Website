const PLAYBOOKS = [
  {
    id: 'launch-checklist',
    title: 'Launch Checklist',
    steps: ['Confirm tool coverage per page', 'Run agent regression flow', 'Review analytics baseline']
  },
  {
    id: 'rollback-plan',
    title: 'Rollback Plan',
    steps: ['Disable new tools via manifest version', 'Re-enable human workflow signage', 'Notify stakeholders']
  },
  {
    id: 'observability',
    title: 'Observability',
    steps: ['Stream success/error events', 'Capture DOM diffs', 'Feed insights into analytics export']
  }
];

export function PlaybookAccordion() {
  return (
    <section className="card" id="docs-playbooks">
      <h2>Operational Playbooks</h2>
      <div className="accordion">
        {PLAYBOOKS.map((item) => (
          <details key={item.id} data-playbook-id={item.id}>
            <summary>{item.title}</summary>
            <ul>
              {item.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}

