import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTMDBDetails, getExternalIDs } from '../services/tmdb'
import { fetchOMDBDetails } from '../services/omdb'

const Details = () => {
  const { type, id } = useParams() // type = 'movie' or 'tv'
  const [tmdbData, setTmdbData] = useState(null)
  const [omdbData, setOmdbData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const tmdb = await getTMDBDetails(type, id)
        const imdbID = await getExternalIDs(type, id)
        const omdb = await fetchOMDBDetails(imdbID)

        setTmdbData(tmdb)
        setOmdbData(omdb)
      } catch (err) {
        setError('Failed to fetch details.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [type, id])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!tmdbData) return null

  const title = tmdbData.title || tmdbData.name
  const poster = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
  const plot = omdbData?.Plot || 'No plot available.'
  const ratings = omdbData?.Ratings || []

  return (
    <div className="details-page">
      <h2>{title}</h2>
      <img src={poster} alt={title} style={{ maxWidth: '250px' }} />
      <p>{plot}</p>

      {ratings.length > 0 && (
        <div>
          <h4>Ratings</h4>
          <ul>
            {ratings.map((r, i) => (
              <li key={i}>
                {r.Source}: {r.Value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Details
