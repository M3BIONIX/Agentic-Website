export function ConsultationForm() {
  return (
    <section className="card" id="consultation-form-section">
      <h2>Reserve a Session</h2>
      <p>Fill in a few details and we will confirm availability within one business day.</p>

      <form id="consultation-form">
        <div className="form-row">
          <div>
            <label htmlFor="consultation-name">Full name</label>
            <input type="text" id="consultation-name" name="consultation-name" placeholder="Alex Rivera" required />
          </div>
          <div>
            <label htmlFor="consultation-company">Company / Team</label>
            <input type="text" id="consultation-company" name="consultation-company" placeholder="Acme Robotics" />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="consultation-objective">Primary objective</label>
            <textarea
              id="consultation-objective"
              name="consultation-objective"
              rows={3}
              placeholder="Outline up to two goals for this session."
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="consultation-preferred-date">Preferred date</label>
            <input type="date" id="consultation-preferred-date" name="consultation-preferred-date" required />
          </div>
          <div>
            <label htmlFor="consultation-preferred-time">Preferred start time</label>
            <input type="time" id="consultation-preferred-time" name="consultation-preferred-time" />
          </div>
        </div>

        <button type="submit" id="consultation-submit">
          Submit request
        </button>
      </form>

      <div id="consultation-status" className="status info" aria-live="polite" />
    </section>
  );
}

