import { formatCurrency, formatDate } from '../utils/formatters'

export default function GameDetails({ game, onDelete, onEdit }) {
  if (!game) {
    return (
      <aside className="details-panel empty-panel">
        <span className="eyebrow">Spotlight</span>
        <h2>No title selected</h2>
        <p>The selected title will appear here.</p>
      </aside>
    )
  }

  return (
    <aside className="details-panel">
      <div className="details-poster" aria-hidden="true">
        <span>{game.name.slice(0, 1)}</span>
      </div>

      <div className="details-copy">
        <span className="eyebrow">{game.genre}</span>
        <h2>{game.name}</h2>
      </div>

      <dl className="details-list">
        <div>
          <dt>Price</dt>
          <dd>{formatCurrency(game.price)}</dd>
        </div>
        <div>
          <dt>Released</dt>
          <dd>{formatDate(game.releaseDate)}</dd>
        </div>
        <div>
          <dt>Game ID</dt>
          <dd>#{game.id}</dd>
        </div>
      </dl>

      <div className="details-actions">
        <button type="button" className="secondary-button" onClick={() => onEdit(game.id)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m4 13.7-.7 3 3-.7 8.6-8.6-2.3-2.3L4 13.7Zm12-7.4.6-.6a1.6 1.6 0 0 0-2.3-2.3l-.6.6L16 6.3Z" />
          </svg>
          Edit title
        </button>
        <button type="button" className="danger-button" onClick={() => onDelete(game)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M7 3h6l1 2h3v2H3V5h3l1-2Zm-1 6h2v7H6V9Zm4 0h2v7h-2V9Zm4 0h2v7h-2V9Z" />
          </svg>
          Delete
        </button>
      </div>
    </aside>
  )
}
