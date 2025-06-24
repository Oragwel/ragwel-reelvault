import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import { debounce } from '../utils/debounce'
import { Link } from 'react-router-dom'
import { searchTMDB, getTrendingMovies } from '../services/tmdb'


const Home = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const debouncedSearch = debounce(async (q) => {
    if (!q) return setResults([])
    try {
      setLoading(true)
      setError(null)
      const data = await searchTMDB(q)
      setResults(data)
    } catch (err) {
      setError('Failed to fetch search results.')
    } finally {
      setLoading(false)
    }
  }, 500)


// Fetch data when query changes
 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = query.trim()
        ? await searchTMDB(query)
        : await getTrendingMovies()

      setResults(data)
    } catch (err) {
      setError('Something went wrong while fetching movies.')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [query])


  return (
    <div>
      <header>
  <h1>🎬 Ragwel ReelVault</h1>
  <p>Find movies and TV shows in seconds.</p>

  <nav>
    <ul className="nav-menu">
      <li><a href="/">Home</a></li>
      <li><a href="#trending">Trending</a></li>
      <li><a href="#genres">Genres</a></li>
      <li><a href="#watchlist">Watchlist</a></li>
    </ul>
  </nav>
</header>

// Search bar
<div className="search-bar">
  <SearchBar query={query} onChange={handleInputChange} />
</div>


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="results">
        {results.map((item) =>
          item.media_type === 'movie' || item.media_type === 'tv' ? (
            <Link
              key={item.id}
              to={`/details/${item.media_type}/${item.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MovieCard
                title={item.title || item.name}
                poster={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : 'https://via.placeholder.com/150x225?text=No+Image'
                }
              />
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Home
