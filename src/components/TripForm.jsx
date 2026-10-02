export default function TripForm({ trip, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target
    onChange({ ...trip, [name]: name === 'numDays' ? Number(value) : value })
  }

  // Opens the native calendar as soon as the field is clicked, instead of
  // letting the user type into it. showPicker() is supported in Chrome,
  // Edge and newer Firefox; older Safari just falls back to normal typing.
  function openDatePicker(e) {
    if (e.target.showPicker) e.target.showPicker()
  }

  return (
    <section>
      <div className="grid">
        <label>
          City
          <input name="city" value={trip.city} onChange={handleChange} placeholder="e.g. Lisbon" />
        </label>
        <label>
          Days
          <input name="numDays" type="number" min="1" max="14" value={trip.numDays} onChange={handleChange} />
        </label>
        <label>
          Start date
          <input
            name="startDate"
            type="date"
            value={trip.startDate}
            onChange={handleChange}
            onClick={openDatePicker}
            onFocus={openDatePicker}
          />
        </label>
        <label>
          Pace
          <select name="pace" value={trip.pace} onChange={handleChange}>
            <option value="relaxed">Relaxed</option>
            <option value="normal">Normal</option>
            <option value="packed">Packed</option>
          </select>
        </label>
      </div>
    </section>
  )
}


