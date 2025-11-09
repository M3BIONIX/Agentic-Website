const TERMS = [
  { term: 'Scoped Manifest', definition: 'Page-specific manifest describing available tools and routes.' },
  { term: 'Binding', definition: 'A registration function that wires DOM events for a tool bundle.' },
  { term: 'Observation', definition: 'Structured event emitted after a tool succeeds or fails.' }
];

export function GlossaryPopover() {
  return (
    <section className="card glossary" id="docs-glossary">
      <h2>Glossary</h2>
      <ul>
        {TERMS.map((entry) => (
          <li key={entry.term}>
            <strong>{entry.term}</strong>
            <span>{entry.definition}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

