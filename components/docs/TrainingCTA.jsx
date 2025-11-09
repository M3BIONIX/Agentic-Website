export function TrainingCTA() {
  return (
    <section className="card training" id="docs-training">
      <h2>Request a Training Session</h2>
      <p>Need a deeper workshop? Provide your details and we will coordinate a hands-on training.</p>

      <form id="training-request-form">
        <div className="form-row">
          <div>
            <label htmlFor="training-name">Full name</label>
            <input type="text" id="training-name" name="training-name" placeholder="Samira Lee" required />
          </div>
          <div>
            <label htmlFor="training-email">Work email</label>
            <input type="email" id="training-email" name="training-email" placeholder="samira@example.com" required />
          </div>
        </div>

        <div>
          <label htmlFor="training-focus-area">Focus area</label>
          <textarea
            id="training-focus-area"
            name="training-focus-area"
            rows={3}
            placeholder="Example: Analytics instrumentation deep dive"
            required
          />
        </div>

        <button type="submit" id="training-submit">
          Request training
        </button>
      </form>

      <div id="training-status" className="status info" aria-live="polite">
        Provide details for a tailored session.
      </div>
    </section>
  );
}

