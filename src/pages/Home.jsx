import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import WatchlistNotification from '../components/WatchlistNotification'
import { debounce } from '../utils/debounce'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import {
  searchTMDB,
  getTrendingMovies,
  getTrendingMoviesOnly,
  getTrendingTVShows,
  getPopularMovies,
  getTopRatedMovies
} from '../services/tmdb'


const Home = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('trending')
  const { watchlist } = useWatchlist()

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleCategoryChange = async (category) => {
    setActiveCategory(category)
    setQuery('') // Clear search when switching categories

    try {
      setLoading(true)
      setError(null)

      let data = []
      switch (category) {
        case 'trending':
          data = await getTrendingMovies()
          break
        case 'movies':
          data = await getTrendingMoviesOnly()
          break
        case 'tv':
          data = await getTrendingTVShows()
          break
        case 'popular':
          data = await getPopularMovies()
          break
        case 'top-rated':
          data = await getTopRatedMovies()
          break
        default:
          data = await getTrendingMovies()
      }

      setResults(data)
    } catch (err) {
      setError('Failed to fetch content.')
    } finally {
      setLoading(false)
    }
  }


// Fetch data when query changes or component mounts
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

// Load trending movies on component mount
useEffect(() => {
  handleCategoryChange('trending')
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  return (
    <div>
      <WatchlistNotification />
      <header>
  <h1>🎬 Ragwel ReelVault</h1>
  <p>Find movies and TV shows in seconds.</p>

  <nav>
    <ul className="nav-menu">
      <li>
        <button
          className={`nav-btn ${activeCategory === 'trending' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('trending')}
        >
          🔥 Trending
        </button>
      </li>
      <li>
        <button
          className={`nav-btn ${activeCategory === 'movies' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('movies')}
        >
          🎬 Movies
        </button>
      </li>
      <li>
        <button
          className={`nav-btn ${activeCategory === 'tv' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('tv')}
        >
          📺 TV Shows
        </button>
      </li>
      <li>
        <button
          className={`nav-btn ${activeCategory === 'popular' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('popular')}
        >
          ⭐ Popular
        </button>
      </li>
    </ul>
  </nav>

  {/* Separate Watchlist Navigation */}
  <div className="watchlist-nav-container">
    <Link to="/watchlist" className="watchlist-nav-btn">
      📝 Watchlist {watchlist.length > 0 && <span className="watchlist-count">({watchlist.length})</span>}
    </Link>
  </div>
</header>

<div className="search-bar">
  <SearchBar query={query} onChange={handleInputChange} />
</div>

{/* Content Section Header */}
{!query && (
  <div className="content-section">
    <h2 className="section-title">
      {activeCategory === 'trending' && '🔥 Trending This Week'}
      {activeCategory === 'movies' && '🎬 Trending Movies'}
      {activeCategory === 'tv' && '📺 Trending TV Shows'}
      {activeCategory === 'popular' && '⭐ Popular Movies'}
      {activeCategory === 'top-rated' && '🏆 Top Rated Movies'}
    </h2>
  </div>
)}

{/* Search Results Header */}
{query && (
  <div className="search-results-header">
    <h2 className="section-title">🔍 Search Results for "{query}"</h2>
  </div>
)}

{loading && <div className="loading">Loading...</div>}
{error && <div className="error">{error}</div>}

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
                movie={item}
                showWatchlistButton={true}
              />
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Home
