const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY
const OMDB_BASE_URL = 'https://www.omdbapi.com/'

export async function fetchOMDBDetails(imdbID) {
  const url = `${OMDB_BASE_URL}?i=${imdbID}&apikey=${OMDB_API_KEY}&plot=full`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('OMDB API request failed.')
  }

  const data = await res.json()
  if (data.Response === 'False') {
    throw new Error(data.Error || 'No results from OMDB.')
  }

  return data
}
