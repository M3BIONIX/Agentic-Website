const TICKETS = [
  {
    id: 'ticket-501',
    customer: 'Kari Lopez',
    subject: 'Clarify enterprise limits',
    priority: 'High'
  },
  {
    id: 'ticket-500',
    customer: 'Marcel Ogun',
    subject: 'Sandbox access not provisioned',
    priority: 'Medium'
  },
  {
    id: 'ticket-499',
    customer: 'Cheyenne Boyd',
    subject: 'Billing profile update request',
    priority: 'Low'
  }
];

export function TicketList() {
  return (
    <section className="card support-list" id="support-ticket-list">
      <h2>Open Tickets</h2>
      <ul>
        {TICKETS.map((ticket) => (
          <li
            key={ticket.id}
            data-ticket-id={ticket.id}
            data-ticket-subject={ticket.subject}
            data-ticket-customer={ticket.customer}
            data-ticket-priority={ticket.priority.toLowerCase()}
          >
            <div className="ticket-meta">
              <span className="ticket-id">{ticket.id}</span>
              <span className={`pill ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
            </div>
            <div className="ticket-body">
              <span className="ticket-subject">{ticket.subject}</span>
              <span className="ticket-customer">{ticket.customer}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

