import React from 'react'
import { useWatchlist } from '../context/WatchlistContext'

const WatchlistNotification = () => {
  const { showNotification, notificationMessage } = useWatchlist()

  if (!showNotification) return null

  return (
    <div className="watchlist-notification">
      <div className="notification-content">
        <span className="notification-message">{notificationMessage}</span>
      </div>
    </div>
  )
}

export default WatchlistNotification
