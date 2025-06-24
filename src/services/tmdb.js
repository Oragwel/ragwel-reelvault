const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY


/**
 * Fetch OMDB details using an IMDb ID
 * @param {string} imdbID - The IMDb ID of the title (e.g., tt3896198)
 * @returns {Promise<Object>} Movie/show data from OMDB
 */


const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export async function getTMDBDetails(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch TMDB details')
  return res.json()
}

export async function getExternalIDs(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/external_ids?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch external IDs')
  const data = await res.json()
  return data.imdb_id // string like "tt3896198"
}

export async function searchTMDB(query) {
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('TMDB API request failed')
  const data = await res.json()
  return data.results
}
