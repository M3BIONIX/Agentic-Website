const SESSIONS = [
  {
    id: 'sess-1008',
    customer: 'River Finch',
    intent: 'Onboarding walkthrough',
    outcome: 'Success'
  },
  {
    id: 'sess-1007',
    customer: 'Nora Gentry',
    intent: 'Plan comparison',
    outcome: 'Escalated'
  },
  {
    id: 'sess-1006',
    customer: 'Julien Zhao',
    intent: 'Billing update',
    outcome: 'Success'
  },
  {
    id: 'sess-1005',
    customer: 'Mika Patel',
    intent: 'Sandbox enablement',
    outcome: 'Success'
  }
];

export function SessionTable() {
  return (
    <section className="card analytics-sessions" id="analytics-sessions">
      <h2>Recent Agent Sessions</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Session</th>
            <th scope="col">Customer</th>
            <th scope="col">Intent</th>
            <th scope="col">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {SESSIONS.map((session) => (
            <tr key={session.id} data-session-id={session.id} data-outcome={session.outcome.toLowerCase()}>
              <td>{session.id}</td>
              <td>{session.customer}</td>
              <td>{session.intent}</td>
              <td>
                <span className={`pill ${session.outcome === 'Success' ? 'success' : 'warning'}`}>
                  {session.outcome}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

