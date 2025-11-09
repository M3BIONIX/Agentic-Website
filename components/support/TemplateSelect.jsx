const TEMPLATES = [
  { id: 'acknowledge', label: 'Acknowledge & Clarify' },
  { id: 'escalate', label: 'Escalate to Specialist' },
  { id: 'close-loop', label: 'Close Loop with Summary' }
];

export function TemplateSelect() {
  return (
    <section className="card support-response" id="support-response-panel">
      <h2>Compose Response</h2>
      <form id="support-response-form">
        <div className="form-row">
          <div>
            <label htmlFor="support-template-select">Template</label>
            <select id="support-template-select" name="support-template-select" defaultValue="acknowledge">
              {TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="support-response-message">Message</label>
          <textarea
            id="support-response-message"
            name="support-response-message"
            rows={4}
            placeholder="Draft your reply. The agent can populate this using response tools."
          />
        </div>

        <button type="submit" id="support-response-send">
          Send response
        </button>
      </form>
      <div id="support-status" className="status info" aria-live="polite">
        Choose a ticket to unlock templates and send responses.
      </div>
    </section>
  );
}

