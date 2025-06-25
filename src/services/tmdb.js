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


export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch trending titles')
  const data = await res.json()
  return data.results
}

export async function getTrendingMoviesOnly() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch trending movies')
  const data = await res.json()
  return data.results
}

export async function getTrendingTVShows() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch trending TV shows')
  const data = await res.json()
  return data.results
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch popular movies')
  const data = await res.json()
  return data.results
}

export async function getTopRatedMovies() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch top rated movies')
  const data = await res.json()
  return data.results
}

export async function getCredits(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch credits')
  const data = await res.json()
  return data
}

export async function getVideos(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch videos')
  const data = await res.json()
  return data.results
}

export async function getSimilar(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch similar content')
  const data = await res.json()
  return data.results
}
