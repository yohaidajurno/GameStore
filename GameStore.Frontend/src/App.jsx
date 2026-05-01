import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createGame,
  deleteGame,
  getGame,
  getGames,
  getGenres,
  updateGame,
} from './api/gameStoreApi'
import EmptyState from './components/EmptyState'
import GameCatalog from './components/GameCatalog'
import GameDetails from './components/GameDetails'
import GameForm from './components/GameForm'
import { formatCurrency } from './utils/formatters'
import './App.css'

const ALL_GENRES = 'all'

function LoadingCatalog() {
  return (
    <div className="catalog-grid" aria-busy="true">
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <span className="visually-hidden">Loading catalog</span>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8.5 3a5.5 5.5 0 0 1 4.3 8.93l3.64 3.63-1.42 1.42-3.63-3.64A5.5 5.5 0 1 1 8.5 3Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  )
}

function App() {
  const [activeGenreId, setActiveGenreId] = useState(ALL_GENRES)
  const [deletingGameId, setDeletingGameId] = useState(null)
  const [editingGame, setEditingGame] = useState(null)
  const [error, setError] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [games, setGames] = useState([])
  const [genres, setGenres] = useState([])
  const [genresError, setGenresError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingGameId, setLoadingGameId] = useState(null)
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState(null)

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedGameId) ?? null,
    [games, selectedGameId],
  )

  const activeGenreName = useMemo(() => {
    if (activeGenreId === ALL_GENRES) {
      return ''
    }

    return genres.find((genre) => genre.id === Number(activeGenreId))?.name ?? ''
  }, [activeGenreId, genres])

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return games.filter((game) => {
      const matchesGenre = activeGenreName ? game.genre === activeGenreName : true
      const matchesQuery = normalizedQuery
        ? `${game.name} ${game.genre}`.toLowerCase().includes(normalizedQuery)
        : true

      return matchesGenre && matchesQuery
    })
  }, [activeGenreName, games, query])

  const spotlightGame = selectedGame ?? filteredGames[0] ?? null

  const totalValue = useMemo(
    () => games.reduce((sum, game) => sum + game.price, 0),
    [games],
  )

  const syncSelectedGame = useCallback((gamesData, preferredGameId) => {
    setSelectedGameId((currentGameId) => {
      if (preferredGameId && gamesData.some((game) => game.id === preferredGameId)) {
        return preferredGameId
      }

      if (gamesData.some((game) => game.id === currentGameId)) {
        return currentGameId
      }

      return gamesData[0]?.id ?? null
    })
  }, [])

  const refreshGames = useCallback(
    async (preferredGameId) => {
      const gamesData = await getGames()
      setGames(gamesData)
      syncSelectedGame(gamesData, preferredGameId)
      return gamesData
    },
    [syncSelectedGame],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialDashboard() {
      const [gamesResult, genresResult] = await Promise.allSettled([
        getGames({ signal: controller.signal }),
        getGenres({ signal: controller.signal }),
      ])

      if (controller.signal.aborted) {
        return
      }

      if (gamesResult.status === 'fulfilled') {
        setGames(gamesResult.value)
        syncSelectedGame(gamesResult.value)
      } else if (gamesResult.reason.name !== 'AbortError') {
        setError(gamesResult.reason.message)
      }

      if (genresResult.status === 'fulfilled') {
        setGenres(genresResult.value)
        setGenresError('')
      } else if (genresResult.reason.name !== 'AbortError') {
        setGenresError(genresResult.reason.message)
      }

      setLoading(false)
    }

    loadInitialDashboard()

    return () => controller.abort()
  }, [syncSelectedGame])

  async function retryLoadDashboard() {
    setError('')
    setGenresError('')
    setLoading(true)

    const [gamesResult, genresResult] = await Promise.allSettled([
      getGames(),
      getGenres(),
    ])

    if (gamesResult.status === 'fulfilled') {
      setGames(gamesResult.value)
      syncSelectedGame(gamesResult.value)
    } else {
      setError(gamesResult.reason.message)
    }

    if (genresResult.status === 'fulfilled') {
      setGenres(genresResult.value)
    } else {
      setGenresError(genresResult.reason.message)
    }

    setLoading(false)
  }

  function openCreateForm() {
    setEditingGame(null)
    setError('')
    setFormMode('create')
    setNotice('')
  }

  async function openEditForm(gameId) {
    setError('')
    setLoadingGameId(gameId)
    setNotice('')

    try {
      const game = await getGame(gameId)
      setEditingGame(game)
      setFormMode('edit')
      setSelectedGameId(gameId)
    } catch (editError) {
      setError(editError.message)
    } finally {
      setLoadingGameId(null)
    }
  }

  function closeForm() {
    setEditingGame(null)
    setFormMode(null)
  }

  async function saveGame(game) {
    setError('')
    setNotice('')
    setSaving(true)

    try {
      if (formMode === 'edit' && editingGame) {
        await updateGame(editingGame.id, game)
        await refreshGames(editingGame.id)
        setNotice(`${game.name} was updated.`)
      } else {
        const createdGame = await createGame(game)
        await refreshGames(createdGame.id)
        setNotice(`${game.name} was created.`)
      }

      closeForm()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeGame(game) {
    const confirmed = window.confirm(`Delete "${game.name}"? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    setDeletingGameId(game.id)
    setError('')
    setNotice('')

    try {
      await deleteGame(game.id)
      await refreshGames()
      setNotice(`${game.name} was deleted.`)

      if (editingGame?.id === game.id) {
        closeForm()
      }
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingGameId(null)
    }
  }

  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <div className="brand-mark">
          <span>GS</span>
          GameStore
        </div>

        <label className="search-box">
          <span className="visually-hidden">Search titles</span>
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search games"
          />
        </label>

        <button type="button" className="primary-button" onClick={openCreateForm}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M9 3h2v6h6v2h-6v6H9v-6H3V9h6V3Z" />
          </svg>
          Add title
        </button>
      </nav>

      <div className="app-shell">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Game catalog</p>
            <h1>Browse your store like a title library.</h1>
            <p>
              Search, filter, inspect, and manage every game from one clean catalog.
            </p>
          </div>

          <div className="hero-stats" aria-label="Catalog summary">
            <article>
              <span>Titles</span>
              <strong>{games.length}</strong>
            </article>
            <article>
              <span>Genres</span>
              <strong>{genres.length}</strong>
            </article>
            <article>
              <span>Value</span>
              <strong>{formatCurrency(totalValue)}</strong>
            </article>
          </div>
        </section>

        {error ? (
          <div className="status-banner error" role="alert">
            <p>{error}</p>
            <button type="button" className="ghost-button" onClick={retryLoadDashboard}>
              Retry
            </button>
          </div>
        ) : null}

        {genresError && !error ? (
          <div className="status-banner warning" role="status">
            <p>Genres could not be loaded. The catalog still works, but genre tools are limited.</p>
            <button type="button" className="ghost-button" onClick={retryLoadDashboard}>
              Retry
            </button>
          </div>
        ) : null}

        {notice ? (
          <div className="status-banner success" role="status">
            <p>{notice}</p>
          </div>
        ) : null}

        {formMode ? (
          <GameForm
            key={`${formMode}-${editingGame?.id ?? 'new'}`}
            game={editingGame}
            genres={genres}
            genresError={genresError}
            mode={formMode}
            onCancel={closeForm}
            onSubmit={saveGame}
            saving={saving}
          />
        ) : null}

        <section className="genre-rail" aria-label="Genres">
          <button
            type="button"
            className={activeGenreId === ALL_GENRES ? 'chip active' : 'chip'}
            onClick={() => setActiveGenreId(ALL_GENRES)}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              className={activeGenreId === String(genre.id) ? 'chip active' : 'chip'}
              onClick={() => setActiveGenreId(String(genre.id))}
            >
              {genre.name}
            </button>
          ))}
        </section>

        <section className="content-grid">
          <div className="catalog-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Discover</p>
                <h2>{filteredGames.length} titles</h2>
              </div>
              {loadingGameId || deletingGameId ? (
                <span className="inline-status">Updating...</span>
              ) : null}
            </div>

            {loading ? (
              <LoadingCatalog />
            ) : filteredGames.length > 0 ? (
              <GameCatalog
                games={filteredGames}
                onSelect={setSelectedGameId}
                selectedGameId={spotlightGame?.id ?? selectedGameId}
              />
            ) : (
              <EmptyState
                description="No titles match the current search."
                title="No matches"
              />
            )}
          </div>

          <GameDetails game={spotlightGame} onDelete={removeGame} onEdit={openEditForm} />
        </section>
      </div>
    </main>
  )
}

export default App
