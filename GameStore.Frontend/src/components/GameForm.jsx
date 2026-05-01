import { useMemo, useState } from 'react'

const emptyValues = {
  genreId: '',
  name: '',
  price: '',
  releaseDate: '',
}

function getInitialValues(game) {
  if (!game) {
    return emptyValues
  }

  return {
    genreId: String(game.genreId ?? ''),
    name: game.name ?? '',
    price: String(game.price ?? ''),
    releaseDate: game.releaseDate ?? '',
  }
}

function validate(values) {
  const errors = {}
  const price = Number(values.price)

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  } else if (values.name.trim().length > 50) {
    errors.name = 'Name must be 50 characters or less.'
  }

  if (!values.genreId) {
    errors.genreId = 'Choose a genre.'
  }

  if (values.price === '') {
    errors.price = 'Price is required.'
  } else if (Number.isNaN(price)) {
    errors.price = 'Price must be a number.'
  } else if (price < 1 || price > 100) {
    errors.price = 'Price must be between 1 and 100.'
  }

  if (!values.releaseDate) {
    errors.releaseDate = 'Release date is required.'
  }

  return errors
}

export default function GameForm({
  game,
  genres,
  genresError,
  mode,
  onCancel,
  onSubmit,
  saving,
}) {
  const [values, setValues] = useState(() => getInitialValues(game))
  const [submitted, setSubmitted] = useState(false)
  const errors = useMemo(() => validate(values), [values])
  const hasErrors = Object.keys(errors).length > 0

  function updateField(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (hasErrors) {
      return
    }

    onSubmit({
      genreId: Number(values.genreId),
      name: values.name.trim(),
      price: Number(values.price),
      releaseDate: values.releaseDate,
    })
  }

  return (
    <form className="game-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <div>
          <p className="eyebrow">{mode === 'edit' ? 'Edit title' : 'New title'}</p>
          <h2>{mode === 'edit' ? game?.name : 'Add title'}</h2>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={onCancel}
          disabled={saving}
        >
          Close
        </button>
      </div>

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input
            name="name"
            value={values.name}
            maxLength="50"
            onChange={updateField}
            aria-invalid={submitted && Boolean(errors.name)}
            aria-describedby={submitted && errors.name ? 'name-error' : undefined}
            disabled={saving}
            autoFocus
          />
          {submitted && errors.name ? (
            <small id="name-error">{errors.name}</small>
          ) : null}
        </label>

        <label>
          <span>Genre</span>
          <select
            name="genreId"
            value={values.genreId}
            onChange={updateField}
            aria-invalid={submitted && Boolean(errors.genreId)}
            aria-describedby={submitted && errors.genreId ? 'genre-error' : undefined}
            disabled={saving || genres.length === 0}
          >
            <option value="">Choose genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {submitted && errors.genreId ? (
            <small id="genre-error">{errors.genreId}</small>
          ) : null}
          {genres.length === 0 ? (
            <small>{genresError || 'Genres are not available from the API yet.'}</small>
          ) : null}
        </label>

        <label>
          <span>Price</span>
          <input
            name="price"
            type="number"
            min="1"
            max="100"
            step="0.01"
            value={values.price}
            onChange={updateField}
            aria-invalid={submitted && Boolean(errors.price)}
            aria-describedby={submitted && errors.price ? 'price-error' : undefined}
            disabled={saving}
          />
          {submitted && errors.price ? (
            <small id="price-error">{errors.price}</small>
          ) : null}
        </label>

        <label>
          <span>Release date</span>
          <input
            name="releaseDate"
            type="date"
            value={values.releaseDate}
            onChange={updateField}
            aria-invalid={submitted && Boolean(errors.releaseDate)}
            aria-describedby={
              submitted && errors.releaseDate ? 'release-date-error' : undefined
            }
            disabled={saving}
          />
          {submitted && errors.releaseDate ? (
            <small id="release-date-error">{errors.releaseDate}</small>
          ) : null}
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : mode === 'edit' ? 'Save title' : 'Create title'}
        </button>
      </div>
    </form>
  )
}
