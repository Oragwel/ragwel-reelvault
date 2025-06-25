import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWatched } from '../context/WatchedContext'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'
import WatchedNotification from '../components/WatchedNotification'

const Watched = () => {
  const { watchedList, clearWatchedList } = useWatched()
  const { watchlist } = useWatchlist()
  const navigate = useNavigate()

  const handleCategoryChange = (category) => {
    // Navigate back to home with the selected category
    navigate('/')
  }

  return (
    <div className="watched-page">
      <WatchedNotification />
      <header>
        <h1>✅ Watched Movies & Shows</h1>
        <p>Your viewing history and completed content</p>
        
        <nav>
          <ul className="nav-menu">
            <li>
              <button 
                className="nav-btn"
                onClick={() => handleCategoryChange('trending')}
              >
                🔥 Trending
              </button>
            </li>
            <li>
              <button 
                className="nav-btn"
                onClick={() => handleCategoryChange('movies')}
              >
                🎬 Movies
              </button>
            </li>
            <li>
              <button 
                className="nav-btn"
                onClick={() => handleCategoryChange('tv')}
              >
                📺 TV Shows
              </button>
            </li>
            <li>
              <button 
                className="nav-btn"
                onClick={() => handleCategoryChange('popular')}
              >
                ⭐ Popular
              </button>
            </li>
            <li>
              <Link to="/watchlist" className="nav-btn watchlist-nav">
                📝 Watchlist {watchlist.length > 0 && <span className="watchlist-count">({watchlist.length})</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="watched-content">
        {watchedList.length === 0 ? (
          <div className="empty-watched">
            <div className="empty-state">
              <h2>✅ No watched content yet</h2>
              <p>Start marking movies and TV shows as watched to keep track of what you've seen!</p>
              <Link to="/" className="back-to-home-btn">
                🔍 Discover Movies
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="watched-header">
              <div className="watched-stats">
                <h2 className="section-title">
                  ✅ Watched ({watchedList.length} {watchedList.length === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <button 
                className="clear-watched-btn"
                onClick={clearWatchedList}
                title="Clear entire watched list"
              >
                🗑️ Clear All
              </button>
            </div>

            <div className="watched-grid">
              {watchedList.map((item) => (
                <Link
                  key={item.id}
                  to={`/details/${item.media_type}/${item.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MovieCard
                    title={item.title}
                    poster={item.poster}
                    movie={item}
                    showWatchlistButton={true}
                    showWatchedButton={true}
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Watched
