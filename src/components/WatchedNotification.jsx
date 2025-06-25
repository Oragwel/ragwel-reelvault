import React from 'react'
import { useWatched } from '../context/WatchedContext'

const WatchedNotification = () => {
  const { showNotification, notificationMessage } = useWatched()

  if (!showNotification) return null

  return (
    <div className="watched-notification">
      <div className="notification-content">
        <span className="notification-message">{notificationMessage}</span>
      </div>
    </div>
  )
}

export default WatchedNotification
