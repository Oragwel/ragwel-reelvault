import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTMDBDetails, getExternalIDs, getCredits, getVideos, getSimilar } from '../services/tmdb'
import { fetchOMDBDetails } from '../services/omdb'
import { useWatchlist } from '../context/WatchlistContext'
import { useWatched } from '../context/WatchedContext'
import WatchlistNotification from '../components/WatchlistNotification'
import WatchedNotification from '../components/WatchedNotification'

const Details = () => {
  const { type, id } = useParams() // type = 'movie' or 'tv'
  const [tmdbData, setTmdbData] = useState(null)
  const [omdbData, setOmdbData] = useState(null)
  const [credits, setCredits] = useState(null)
  const [videos, setVideos] = useState([])
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const { markAsWatched, removeFromWatched, isWatched } = useWatched()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [tmdb, creditsData, videosData, similarData] = await Promise.all([
          getTMDBDetails(type, id),
          getCredits(type, id),
          getVideos(type, id),
          getSimilar(type, id)
        ])

        // Get OMDB data using IMDb ID
        const imdbID = await getExternalIDs(type, id)
        const omdb = await fetchOMDBDetails(imdbID)

        setTmdbData(tmdb)
        setOmdbData(omdb)
        setCredits(creditsData)
        setVideos(videosData)
        setSimilar(similarData)
      } catch (err) {
        setError('Failed to fetch details.')
        console.error('Error fetching details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [type, id])

  // Helper functions for button actions
  const handleWatchlistClick = () => {
    if (isInWatchlist(tmdbData.id)) {
      removeFromWatchlist(tmdbData.id)
    } else {
      addToWatchlist(tmdbData)
    }
  }

  const handleWatchedClick = () => {
    if (isWatched(tmdbData.id)) {
      removeFromWatched(tmdbData.id)
    } else {
      markAsWatched(tmdbData)
    }
  }

  if (loading) return (
    <div className="details-page">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading details...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="details-page">
      <div className="error-container">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-btn">← Back to Home</Link>
      </div>
    </div>
  )

  if (!tmdbData) return null

  // Extract data
  const title = tmdbData.title || tmdbData.name
  const poster = tmdbData.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
  const backdrop = tmdbData.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}`
    : null
  const plot = tmdbData.overview || omdbData?.Plot || 'No plot available.'
  const releaseDate = tmdbData.release_date || tmdbData.first_air_date
  const runtime = tmdbData.runtime || omdbData?.Runtime
  const genres = tmdbData.genres || []
  const ratings = omdbData?.Ratings || []
  const cast = credits?.cast?.slice(0, 10) || []
  const crew = credits?.crew?.filter(person =>
    person.job === 'Director' || person.job === 'Producer' || person.job === 'Writer'
  ).slice(0, 5) || []
  const trailer = videos?.find(video =>
    video.type === 'Trailer' && video.site === 'YouTube'
  )
  const similarMovies = similar?.slice(0, 6) || []

  const inWatchlist = isInWatchlist(tmdbData.id)
  const hasWatched = isWatched(tmdbData.id)

  return (
    <div className="details-page">
      <WatchlistNotification />
      <WatchedNotification />

      {/* Backdrop Header */}
      {backdrop && (
        <div className="backdrop-header" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="backdrop-overlay">
            <Link to="/" className="back-btn">← Back to Home</Link>
          </div>
        </div>
      )}

      <div className="details-container">
        {/* Main Content */}
        <div className="details-main">
          <div className="details-poster">
            <img src={poster} alt={title} />
          </div>

          <div className="details-info">
            <h1 className="details-title">{title}</h1>

            {/* Meta Information */}
            <div className="details-meta">
              {releaseDate && (
                <span className="meta-item">
                  📅 {new Date(releaseDate).getFullYear()}
                </span>
              )}
              {runtime && (
                <span className="meta-item">
                  ⏱️ {runtime}
                </span>
              )}
              {tmdbData.vote_average && (
                <span className="meta-item rating">
                  ⭐ {tmdbData.vote_average.toFixed(1)}/10
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="genres">
                {genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            <div className="plot-section">
              <h3>📖 Plot</h3>
              <p className="plot-text">{plot}</p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className={`action-btn watchlist-btn ${inWatchlist ? 'active' : ''}`}
                onClick={handleWatchlistClick}
              >
                {inWatchlist ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
              </button>

              <button
                className={`action-btn watched-btn ${hasWatched ? 'active' : ''}`}
                onClick={handleWatchedClick}
              >
                {hasWatched ? '✅ Watched' : '⭕ Mark as Watched'}
              </button>

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn trailer-btn"
                >
                  🎬 Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="details-additional">
          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="cast-section">
              <h3>🎭 Cast</h3>
              <div className="cast-grid">
                {cast.map(actor => (
                  <div key={actor.id} className="cast-member">
                    <img
                      src={actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Photo'
                      }
                      alt={actor.name}
                    />
                    <div className="cast-info">
                      <p className="actor-name">{actor.name}</p>
                      <p className="character-name">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {crew.length > 0 && (
            <div className="crew-section">
              <h3>🎬 Crew</h3>
              <div className="crew-list">
                {crew.map(person => (
                  <div key={`${person.id}-${person.job}`} className="crew-member">
                    <span className="crew-job">{person.job}:</span>
                    <span className="crew-name">{person.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings Section */}
          {ratings.length > 0 && (
            <div className="ratings-section">
              <h3>⭐ Ratings</h3>
              <div className="ratings-grid">
                {ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <span className="rating-source">{rating.Source}</span>
                    <span className="rating-value">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="similar-section">
              <h3>🎯 Similar {type === 'movie' ? 'Movies' : 'TV Shows'}</h3>
              <div className="similar-grid">
                {similarMovies.map(item => (
                  <Link
                    key={item.id}
                    to={`/details/${type}/${item.id}`}
                    className="similar-item"
                  >
                    <img
                      src={item.poster_path
                        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                      }
                      alt={item.title || item.name}
                    />
                    <p>{item.title || item.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Details
