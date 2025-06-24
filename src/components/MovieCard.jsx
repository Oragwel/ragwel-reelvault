import React from 'react'
import { useWatchlist } from '../context/WatchlistContext'

const MovieCard = ({ title, poster, movie, showWatchlistButton = true }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  const handleWatchlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  const inWatchlist = isInWatchlist(movie?.id)

  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img src={poster} alt={title} />
      </div>
      <div className="movie-card-content">
        <h3>{title}</h3>
        {showWatchlistButton && movie && (
          <button
            className={`watchlist-btn-bottom ${inWatchlist ? 'in-watchlist' : ''}`}
            onClick={handleWatchlistClick}
          >
            {inWatchlist ? (
              <>
                <span className="btn-icon">❤️</span>
                <span className="btn-text">In Watchlist</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🤍</span>
                <span className="btn-text">Add to Watchlist</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieCard
