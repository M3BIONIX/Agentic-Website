const CURRENT_WEEK = [
  { day: 'Monday', slots: ['09:00', '13:00'] },
  { day: 'Tuesday', slots: ['10:00', '15:00'] },
  { day: 'Wednesday', slots: ['09:30', '14:00'] },
  { day: 'Thursday', slots: ['11:00', '16:30'] },
  { day: 'Friday', slots: ['09:00', '12:30'] }
];

export function AvailabilityCalendar() {
  return (
    <section className="card availability" id="consultation-availability">
      <h2>Live Availability</h2>
      <p>Select a preferred date and we will align with your timezone.</p>

      <div className="availability-picker">
        <label htmlFor="consultation-date">Preferred date</label>
        <input type="date" id="consultation-date" name="consultation-date" />

        <label htmlFor="consultation-time">Preferred time</label>
        <input type="time" id="consultation-time" name="consultation-time" />
      </div>

      <div className="availability-slots">
        <h3>This week&apos;s quick-start slots</h3>
        <ul>
          {CURRENT_WEEK.map((entry) => (
            <li key={entry.day}>
              <span className="day">{entry.day}</span>
              <span className="slots">{entry.slots.join(' • ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

