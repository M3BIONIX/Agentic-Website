const SECTIONS = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: [
      'This knowledge base distills practical guidance for agent-enabled experiences. Each section references a scoped set of tools so your manifests remain compact.'
    ]
  },
  {
    id: 'tool-design',
    title: 'Designing Tools',
    body: [
      'Group actions by real-world intent rather than individual inputs.',
      'Expose stable identifiers in the DOM so agents can target exactly what they need.',
      'Return descriptive errors when a tool cannot run to guide agent retries.'
    ]
  },
  {
    id: 'testing',
    title: 'Testing Agents',
    body: [
      'Instrument both human and agent paths to compare performance.',
      'Capture DOM events (success/error) to trace the agent journey.',
      'Use the analytics dashboard export to feed automated regression suites.'
    ]
  },
  {
    id: 'governance',
    title: 'Governance',
    body: [
      'Rotate API keys used by agents as often as human credentials.',
      'Document escalation routes for sensitive flows like billing or compliance.',
      'Keep manifests versioned and code-reviewed alongside application changes.'
    ]
  }
];

export function DocContent() {
  return (
    <article className="doc-content" id="docs-content">
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} data-doc-section={section.id}>
          <header>
            <h2>{section.title}</h2>
          </header>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}

