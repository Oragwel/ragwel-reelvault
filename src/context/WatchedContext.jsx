import React, { createContext, useContext, useState, useEffect } from 'react'

const WatchedContext = createContext()

export const useWatched = () => {
  const context = useContext(WatchedContext)
  if (!context) {
    throw new Error('useWatched must be used within a WatchedProvider')
  }
  return context
}

export const WatchedProvider = ({ children }) => {
  const [watchedList, setWatchedList] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Load watched list from localStorage on component mount
  useEffect(() => {
    const savedWatchedList = localStorage.getItem('reelvault-watched')
    if (savedWatchedList) {
      try {
        setWatchedList(JSON.parse(savedWatchedList))
      } catch (error) {
        console.error('Error loading watched list from localStorage:', error)
      }
    }
  }, [])

  // Save watched list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('reelvault-watched', JSON.stringify(watchedList))
  }, [watchedList])

  const markAsWatched = (movie) => {
    if (!isWatched(movie.id)) {
      const watchedItem = {
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : 'https://via.placeholder.com/150x225?text=No+Image',
        media_type: movie.media_type || 'movie',
        release_date: movie.release_date || movie.first_air_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
        watchedAt: new Date().toISOString()
      }
      
      setWatchedList(prev => [watchedItem, ...prev])
      showNotificationMessage(`✅ "${movie.title || movie.name}" marked as watched!`)
    }
  }

  const removeFromWatched = (movieId) => {
    const movie = watchedList.find(item => item.id === movieId)
    setWatchedList(prev => prev.filter(item => item.id !== movieId))
    if (movie) {
      showNotificationMessage(`↩️ "${movie.title}" removed from watched list!`)
    }
  }

  const isWatched = (movieId) => {
    return watchedList.some(item => item.id === movieId)
  }

  const clearWatchedList = () => {
    setWatchedList([])
    showNotificationMessage('🗑️ Watched list cleared!')
  }

  const showNotificationMessage = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const value = {
    watchedList,
    markAsWatched,
    removeFromWatched,
    isWatched,
    clearWatchedList,
    showNotification,
    notificationMessage
  }

  return (
    <WatchedContext.Provider value={value}>
      {children}
    </WatchedContext.Provider>
  )
}
