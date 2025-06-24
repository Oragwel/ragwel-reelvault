import React from 'react'

const SearchBar = ({ query, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder="🔍 Search movies or shows..."
      />
    </div>
  )
}

export default SearchBar
