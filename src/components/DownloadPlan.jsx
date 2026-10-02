import { useState } from 'react'
import { buildCsv, buildIcs, download, parseBackup, slug } from '../utils/exporters'

export default function DownloadPlan({ itinerary, places, trip, onImport }) {
  const [message, setMessage] = useState('')
  const name = slug(trip.city)
  const hasDate = Boolean(trip.startDate)

  function handleBackupExport() {
    const text = JSON.stringify({ version: 1, trip, places }, null, 2)
    download(`${name}-backup.json`, text, 'application/json')
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        onImport(parseBackup(String(reader.result)))
        setMessage('Backup restored.')
      } catch (err) {
        setMessage(err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <section className="section">
      <h2>Download your plan</h2>
      <div className="fixes">
        <button type="button" disabled={!hasDate}
          onClick={() => download(`${name}-plan.ics`, buildIcs(itinerary, places, trip), 'text/calendar')}>
          Calendar (.ics)
        </button>
        <button type="button"
          onClick={() => download(`${name}-plan.csv`, buildCsv(itinerary, places, trip), 'text/csv')}>
          Excel / CSV
        </button>
        <button type="button" onClick={() => window.print()}>PDF (print)</button>
      </div>
      {!hasDate && <p className="muted">Set a start date in "Your trip" to enable the calendar export.</p>}

      <p className="muted backup-note">
        Your trip is only saved in this browser. Download a backup to keep it safe or move it to another device.
      </p>
      <div className="fixes">
        <button type="button" onClick={handleBackupExport}>Download backup (.json)</button>
        <label className="file-button">
          Restore from file
          <input type="file" accept="application/json,.json" onChange={handleFile} />
        </label>
      </div>
      {message && <p role="status" className="muted">{message}</p>}
    </section>
  )
}
