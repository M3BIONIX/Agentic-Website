const HIGHLIGHTS = [
  'Work with a solutions architect to shape your agent playbooks.',
  'Review compliance, governance, and deployment strategies.',
  'Receive a tailored roadmap and integration timeline.'
];

export function ConsultationOverview() {
  return (
    <section className="card" id="consultation-overview">
      <header className="section-heading">
        <div>
          <h2>Strategic Consultation</h2>
          <p>
            Align stakeholders, surface requirements, and design high-impact agent experiences. Our facilitators guide
            you from discovery to pilot launch.
          </p>
        </div>
      </header>

      <ul className="highlight-list">
        {HIGHLIGHTS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

