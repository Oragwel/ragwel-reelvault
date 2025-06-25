import React from 'react'
import { useWatchlist } from '../context/WatchlistContext'
import { useWatched } from '../context/WatchedContext'

const MovieCard = ({ title, poster, movie, showWatchlistButton = true, showWatchedButton = true }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const { markAsWatched, removeFromWatched, isWatched } = useWatched()

  const handleWatchlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  const handleWatchedClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWatched(movie.id)) {
      removeFromWatched(movie.id)
    } else {
      markAsWatched(movie)
    }
  }

  const inWatchlist = isInWatchlist(movie?.id)
  const hasWatched = isWatched(movie?.id)

  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img src={poster} alt={title} />
      </div>
      <div className="movie-card-content">
        <h3>{title}</h3>
        <div className="movie-card-buttons">
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
          {showWatchedButton && movie && (
            <button
              className={`watched-btn-bottom ${hasWatched ? 'is-watched' : ''}`}
              onClick={handleWatchedClick}
            >
              {hasWatched ? (
                <>
                  <span className="btn-icon">✅</span>
                  <span className="btn-text">Watched</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">⭕</span>
                  <span className="btn-text">Mark as Watched</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
