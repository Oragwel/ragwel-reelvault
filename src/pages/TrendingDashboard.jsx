import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { useWatched } from '../context/WatchedContext'
import MovieCard from '../components/MovieCard'
import WatchlistNotification from '../components/WatchlistNotification'
import WatchedNotification from '../components/WatchedNotification'
import {
  getTrendingMovies,
  getTrendingMoviesOnly,
  getTrendingTVShows,
  getPopularMovies,
  getTopRatedMovies
} from '../services/tmdb'

const TrendingDashboard = () => {
  const [trendingAll, setTrendingAll] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('all')
  
  const { watchlist } = useWatchlist()
  const { watchedList } = useWatched()

  // Ensure arrays are defined with fallbacks
  const safeWatchlist = watchlist || []
  const safeWatchedList = watchedList || []

  useEffect(() => {
    const fetchAllTrendingData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all trending data in parallel for better performance
        const [trending, movies, tv, popular, topRated] = await Promise.all([
          getTrendingMovies(),
          getTrendingMoviesOnly(),
          getTrendingTVShows(),
          getPopularMovies(),
          getTopRatedMovies()
        ])

        setTrendingAll(trending.slice(0, 12))
        setTrendingMovies(movies.slice(0, 8))
        setTrendingTV(tv.slice(0, 8))
        setPopularMovies(popular.slice(0, 8))
        setTopRatedMovies(topRated.slice(0, 8))
      } catch (err) {
        setError('Failed to fetch trending content.')
        console.error('Error fetching trending data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllTrendingData()
  }, [])

  if (loading) return (
    <div className="trending-dashboard">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trending content...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="trending-dashboard">
      <div className="error-container">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-btn">← Back to Home</Link>
      </div>
    </div>
  )

  const renderMovieGrid = (movies, linkType = 'movie') => (
    <div className="dashboard-grid">
      {movies.map((item) => (
        <Link
          key={item.id}
          to={`/details/${item.media_type || linkType}/${item.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MovieCard
            title={item.title || item.name}
            poster={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
            }
            movie={item}
            showWatchlistButton={true}
            showWatchedButton={true}
          />
        </Link>
      ))}
    </div>
  )

  return (
    <div className="trending-dashboard">
      <WatchlistNotification />
      <WatchedNotification />
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Trending Content Dashboard</h1>
          <p>Discover what's hot and popular right now</p>
          
          <nav className="dashboard-nav">
            <Link to="/" className="nav-btn">🏠 Home</Link>
            <Link to="/watchlist" className="nav-btn">
              📝 Watchlist {safeWatchlist.length > 0 && <span className="count-badge">({safeWatchlist.length})</span>}
            </Link>
            <Link to="/watched" className="nav-btn">
              ✅ Watched {safeWatchedList.length > 0 && <span className="count-badge">({safeWatchedList.length})</span>}
            </Link>
          </nav>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Quick Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📝 Watchlist</h3>
              <p className="stat-number">{safeWatchlist.length}</p>
              <span className="stat-label">Items to watch</span>
            </div>
            <div className="stat-card">
              <h3>✅ Watched</h3>
              <p className="stat-number">{safeWatchedList.length}</p>
              <span className="stat-label">Items completed</span>
            </div>
            <div className="stat-card">
              <h3>🔥 Trending</h3>
              <p className="stat-number">{trendingAll.length}</p>
              <span className="stat-label">Hot content</span>
            </div>
          </div>
        </section>

        {/* Section Navigation */}
        <section className="section-nav">
          <div className="section-buttons">
            <button 
              className={`section-btn ${activeSection === 'all' ? 'active' : ''}`}
              onClick={() => setActiveSection('all')}
            >
              🔥 All Trending
            </button>
            <button 
              className={`section-btn ${activeSection === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveSection('movies')}
            >
              🎬 Movies
            </button>
            <button 
              className={`section-btn ${activeSection === 'tv' ? 'active' : ''}`}
              onClick={() => setActiveSection('tv')}
            >
              📺 TV Shows
            </button>
            <button 
              className={`section-btn ${activeSection === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveSection('popular')}
            >
              ⭐ Popular
            </button>
            <button 
              className={`section-btn ${activeSection === 'toprated' ? 'active' : ''}`}
              onClick={() => setActiveSection('toprated')}
            >
              🏆 Top Rated
            </button>
          </div>
        </section>

        {/* Dynamic Content Sections */}
        {activeSection === 'all' && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">🔥 Trending This Week</h2>
              <p className="section-subtitle">The hottest movies and TV shows everyone's talking about</p>
            </div>
            {renderMovieGrid(trendingAll)}
          </section>
        )}

        {activeSection === 'movies' && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">🎬 Trending Movies</h2>
              <p className="section-subtitle">Most popular movies trending right now</p>
            </div>
            {renderMovieGrid(trendingMovies, 'movie')}
          </section>
        )}

        {activeSection === 'tv' && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">📺 Trending TV Shows</h2>
              <p className="section-subtitle">Binge-worthy shows everyone's watching</p>
            </div>
            {renderMovieGrid(trendingTV, 'tv')}
          </section>
        )}

        {activeSection === 'popular' && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">⭐ Popular Movies</h2>
              <p className="section-subtitle">All-time popular movies loved by audiences</p>
            </div>
            {renderMovieGrid(popularMovies, 'movie')}
          </section>
        )}

        {activeSection === 'toprated' && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">🏆 Top Rated Movies</h2>
              <p className="section-subtitle">Critically acclaimed masterpieces</p>
            </div>
            {renderMovieGrid(topRatedMovies, 'movie')}
          </section>
        )}
      </div>
    </div>
  )
}

export default TrendingDashboard
