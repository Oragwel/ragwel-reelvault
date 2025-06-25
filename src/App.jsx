import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { WatchedProvider } from './context/WatchedContext'
import Home from './pages/Home'
import Details from './pages/Details'
import Watchlist from './pages/Watchlist'
import Watched from './pages/Watched'
import TrendingDashboard from './pages/TrendingDashboard'

const App = () => {
  return (
    <WatchlistProvider>
      <WatchedProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:type/:id" element={<Details />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="/trending" element={<TrendingDashboard />} />
          </Routes>
        </div>
      </WatchedProvider>
    </WatchlistProvider>
  )
}

export default App
