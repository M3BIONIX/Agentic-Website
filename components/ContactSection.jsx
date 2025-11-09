export function ContactSection() {
  return (
    <section className="card" id="contact-form-section">
      <h2>Contact Us</h2>
      <p>Reach out with any questions. The AI agent can also complete this form on your behalf.</p>
      <form id="contact-form">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Jane Doe" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="jane@example.com" required />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} placeholder="How can we help you today?" />
        </div>
        <button type="submit" id="submit-btn">
          Submit
        </button>
      </form>
      <div id="form-status" className="status info" aria-live="polite" />
    </section>
  );
}

