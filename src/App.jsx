import { useMemo } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TripForm from './components/TripForm'
import PlaceForm from './components/PlaceForm'
import PlaceList from './components/PlaceList'
import MapView from './components/MapView'
import FeasibilityBanner from './components/FeasibilityBanner'
import PlanControls from './components/PlanControls'
import DayView from './components/DayView'
import DownloadPlan from './components/DownloadPlan'
import { checkFeasibility } from './utils/feasibility'
import { planTrip } from './utils/planner'

const defaultTrip = { city: '', numDays: 3, startDate: '', pace: 'normal' }

export default function App() {
  const [trip, setTrip] = useLocalStorage('tp-trip', defaultTrip)
  const [places, setPlaces] = useLocalStorage('tp-places', [])
  const [planned, setPlanned] = useLocalStorage('tp-planned', false)

  function addPlace(place) {
    setPlaces([...places, { ...place, id: crypto.randomUUID() }])
  }

  function deletePlace(id) {
    setPlaces(places.filter((p) => p.id !== id))
  }

  function movePlace(id, dayIndex) {
    setPlaces(places.map((p) => (p.id === id ? { ...p, pinnedDay: dayIndex } : p)))
  }

  function importBackup(data) {
    setTrip(data.trip)
    setPlaces(data.places)
    setPlanned(false)
  }

  // Reset: clears the trip back to its starting point, so the user begins a new plan from scratch.
  function resetTrip() {
    setTrip(defaultTrip)
    setPlaces([])
    setPlanned(false)
  }

  const feasibility = checkFeasibility(places, trip)
  const itinerary = useMemo(() => (planned ? planTrip(places, trip) : null), [planned, places, trip])

  return (
    <main className="app">
      <header className="no-print">
        <h1>Travel Planner</h1>
        <p className="subhead">Plan a trip around the places you actually want to see.</p>
      </header>
      <h1 className="print-only">{trip.city ? `${trip.city}: ` : ''}{trip.numDays}-day plan</h1>

      <div className="no-print">

        <section className="section">
          <h2>Your trip</h2>
          <TripForm trip={trip} onChange={setTrip} />
          <PlaceForm onAdd={addPlace} city={trip.city} />
          <FeasibilityBanner result={feasibility} trip={trip} onChangeTrip={setTrip} onDeletePlace={deletePlace} />
        </section>
        
        <MapView places={places} />
        
        <div className="plan-controls">
          <PlanControls
            status={feasibility.status}
            planned={planned}
            hasPlaces={places.length > 0}
            onPlan={() => setPlanned(true)}
            onClear={() => setPlanned(false)}
          />
          <button type="button" className="link-reset" onClick={resetTrip}>Reset</button>
        </div>
      </div>

      {itinerary && <DayView itinerary={itinerary} places={places} trip={trip} onMove={movePlace} />}

      <div className="no-print">
        <PlaceList places={places} onDelete={deletePlace} />
        {itinerary && <DownloadPlan itinerary={itinerary} places={places} trip={trip} onImport={importBackup} />}
      </div>
    </main>
  )
}
