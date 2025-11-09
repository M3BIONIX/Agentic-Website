const FAQ_ENTRIES = [
  {
    id: 'duration',
    question: 'How long does a consultation last?',
    answer: 'Most sessions run 50 minutes with a 10-minute buffer for next steps.'
  },
  {
    id: 'team',
    question: 'Who should join the call?',
    answer:
      'We recommend product owners, engineering leads, and anyone accountable for agent adoption or compliance review.'
  },
  {
    id: 'prep',
    question: 'What preparation is required?',
    answer:
      'Bring a short brief on your target workflows and any existing documentation. We provide a template if you need it.'
  }
];

export function FaqAccordion() {
  return (
    <section className="card faq" id="consultation-faq">
      <h2>Frequently Asked Questions</h2>
      <div className="accordion">
        {FAQ_ENTRIES.map((entry) => (
          <details key={entry.id} data-faq-id={entry.id}>
            <summary>{entry.question}</summary>
            <p>{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

