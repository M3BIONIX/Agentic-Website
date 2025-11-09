const CHECKLIST_ITEMS = [
  { id: 'context-shared', label: 'Context shared with customer' },
  { id: 'handoff-complete', label: 'Escalation / handoff complete' },
  { id: 'notes-logged', label: 'Notes logged in CRM' }
];

export function ResolutionChecklist() {
  return (
    <section className="card support-checklist" id="support-checklist">
      <h2>Resolution Checklist</h2>
      <ul>
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.id}>
            <label htmlFor={`check-${item.id}`}>
              <input type="checkbox" id={`check-${item.id}`} data-checklist-id={item.id} />
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

