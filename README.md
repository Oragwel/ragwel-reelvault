# 🎬 Ragwel ReelVault

**Ragwel ReelVault** is a React-based movie and TV show discovery app that integrates TMDB and OMDB APIs. Users can search for titles, browse posters, and explore detailed ratings and summaries with a smooth, modern interface.

---

## 🚀 Features

- 🔎 Real-time search for movies and TV shows
- 🖼️ Posters and metadata from TMDB
- 📄 Detailed ratings and full plot summaries from OMDB
- 🔗 Route-based navigation using React Router
- ⚡ Fast development with Vite + React

---

## 🛠️ Technologies Used

- **React**
- **Vite**
- **TMDB API**
- **OMDB API**
- **React Router DOM**

---

## 📂 Project Structure

```

ragwel-reelvault/
├── public/
│   └── index.html                  # Entry HTML file
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── MovieCard.jsx
│   │   └── SearchBar.jsx
│   ├── pages/                      # Route-based views
│   │   ├── Home.jsx                # Search + result listing
│   │   └── Details.jsx             # TMDB + OMDB detail view
│   ├── services/                   # API functions
│   │   ├── tmdb.js                 # TMDB API handlers (search, details, external IDs)
│   │   └── omdb.js                 # OMDB API handler (fetchOMDBDetails)
│   ├── utils/
│   │   └── debounce.js             # Debounce helper for search input
│   ├── App.jsx                     # Main route layout
│   └── main.jsx                    # React + Router root entry
├── .env                            # API keys (not checked into Git)
├── .gitignore                      # Ignores node_modules, .env, etc.
├── package.json                    # Dependencies and scripts
├── README.md                       # Project overview and setup instructions
└── vite.config.js                  # Vite configuration (if customized)

---

## 🏁 Getting Started   

1. Clone the repository : `git clone https://github.com/oragwelr/raqwel-reelvault.git`
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory and add your TMDB and OMDB API keys
4. Start the development server with `npm run dev`

---


## 📝 License

This project is licensed under the MIT License.
