import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import Home from './pages/Home'
import Details from './pages/Details'
import Watchlist from './pages/Watchlist'

const App = () => {
  return (
    <WatchlistProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
    </WatchlistProvider>
  )
}

export default App
