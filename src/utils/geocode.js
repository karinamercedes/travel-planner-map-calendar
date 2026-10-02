// Place search using OpenStreetMap's free Nominatim service.
// Nominatim's usage policy caps requests at roughly 1 per second and discourages
// raw keystroke-by-keystroke autocomplete, so results update live but debounced
// (we wait until typing pauses) rather than firing on every keystroke.
const cache = new Map()

export async function searchPlaces(query, city, signal) {
  const q = city ? `${query}, ${city}` : query
  if (cache.has(q)) return cache.get(q)

  const url =
    'https://nominatim.openstreetmap.org/search?' +
    new URLSearchParams({ q, format: 'jsonv2', limit: '5' })

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()

  const results = data.map((r) => ({
    id: r.place_id,
    name: r.name || r.display_name.split(',')[0],
    address: r.display_name,
    lat: Number(r.lat),
    lon: Number(r.lon),
  }))
  cache.set(q, results)
  return results
}
