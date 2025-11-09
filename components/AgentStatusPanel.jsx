export function AgentStatusPanel() {
  return (
    <section className="debug-panel" id="agent-status">
      <h3>Agent Status</h3>
      <p id="last-event">No events received yet.</p>
      <div className="event-log" id="event-log" />
      <p>
        Tip: tools emit DOM events so BrowserOS-style agents can trigger actions even when this site is
        deployed statically (e.g., via XAMPP).
      </p>
    </section>
  );
}


