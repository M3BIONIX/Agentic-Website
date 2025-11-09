const THREAD = [
  {
    from: 'Customer',
    time: '09:21',
    message:
      'Hi team, could you outline the enterprise limits after we cross 10,000 automated sessions per hour? We need clarity for procurement.'
  },
  {
    from: 'Agent',
    time: '09:39',
    message: 'Absolutely! Drafting a summary now, including burst allowances and SLA guarantees.'
  }
];

export function TicketDetail() {
  return (
    <section className="card support-detail" id="support-ticket-detail">
      <header>
        <h2>Ticket Detail</h2>
        <p id="support-ticket-summary">Select a ticket to load its conversation.</p>
      </header>
      <div className="conversation" id="support-conversation">
        {THREAD.map((entry, index) => (
          <article key={index} className={`message ${entry.from === 'Agent' ? 'outbound' : 'inbound'}`}>
            <div className="message-meta">
              <span>{entry.from}</span>
              <time>{entry.time}</time>
            </div>
            <p>{entry.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

