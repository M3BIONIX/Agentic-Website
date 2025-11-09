const DOC_SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'tool-design', label: 'Designing Tools' },
  { id: 'testing', label: 'Testing Agents' },
  { id: 'governance', label: 'Governance' }
];

export function DocSidebar() {
  return (
    <nav className="doc-sidebar" aria-label="Documentation sections">
      <h2>Playbook</h2>
      <ul>
        {DOC_SECTIONS.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} data-section-id={section.id}>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

