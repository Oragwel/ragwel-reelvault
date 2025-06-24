import React, { createContext, useContext, useState, useEffect } from 'react'

const WatchlistContext = createContext()

export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('reelvault-watchlist')
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error)
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('reelvault-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (movie) => {
    if (!isInWatchlist(movie.id)) {
      const watchlistItem = {
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : 'https://via.placeholder.com/150x225?text=No+Image',
        media_type: movie.media_type || 'movie',
        release_date: movie.release_date || movie.first_air_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString()
      }
      
      setWatchlist(prev => [watchlistItem, ...prev])
      showNotificationMessage(`✅ "${movie.title || movie.name}" added to watchlist!`)
    }
  }

  const removeFromWatchlist = (movieId) => {
    const movie = watchlist.find(item => item.id === movieId)
    setWatchlist(prev => prev.filter(item => item.id !== movieId))
    if (movie) {
      showNotificationMessage(`❌ "${movie.title}" removed from watchlist!`)
    }
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(item => item.id === movieId)
  }

  const clearWatchlist = () => {
    setWatchlist([])
    showNotificationMessage('🗑️ Watchlist cleared!')
  }

  const showNotificationMessage = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist,
    showNotification,
    notificationMessage
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}
