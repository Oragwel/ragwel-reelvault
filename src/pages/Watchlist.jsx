import React from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist()

  return (
    <div className="watchlist-page">
      <header>
        <h1>📝 My Watchlist</h1>
        <p>Your saved movies and TV shows</p>
        
        <nav>
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-btn">
                🏠 Home
              </Link>
            </li>
            <li>
              <button className="nav-btn active">
                📝 Watchlist
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="watchlist-content">
        {watchlist.length === 0 ? (
          <div className="empty-watchlist">
            <div className="empty-state">
              <h2>📝 Your watchlist is empty</h2>
              <p>Start adding movies and TV shows to keep track of what you want to watch!</p>
              <Link to="/" className="back-to-home-btn">
                🔍 Discover Movies
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="watchlist-header">
              <div className="watchlist-stats">
                <h2 className="section-title">
                  📝 My Watchlist ({watchlist.length} {watchlist.length === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <button 
                className="clear-watchlist-btn"
                onClick={clearWatchlist}
                title="Clear entire watchlist"
              >
                🗑️ Clear All
              </button>
            </div>

            <div className="watchlist-grid">
              {watchlist.map((item) => (
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

export default Watchlist
