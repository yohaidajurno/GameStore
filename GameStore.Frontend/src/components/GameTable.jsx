import { formatCurrency, formatDate } from '../utils/formatters'

function SortIcon() {
  return (
    <svg className="sort-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6h8L8 2 4 6Zm8 4H4l4 4 4-4Z" />
    </svg>
  )
}

export default function GameTable({
  deletingGameId,
  games,
  loadingGameId,
  onDelete,
  onEdit,
  onSelect,
  selectedGameId,
}) {
  return (
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <span>
                Name
                <SortIcon />
              </span>
            </th>
            <th scope="col">Genre</th>
            <th scope="col">Price</th>
            <th scope="col">Release date</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const isSelected = game.id === selectedGameId
            const isDeleting = game.id === deletingGameId
            const isLoading = game.id === loadingGameId

            return (
              <tr key={game.id} className={isSelected ? 'selected-row' : ''}>
                <td>
                  <button
                    type="button"
                    className="link-button"
                    aria-pressed={isSelected}
                    onClick={() => onSelect(game.id)}
                  >
                    {game.name}
                  </button>
                </td>
                <td>{game.genre}</td>
                <td>{formatCurrency(game.price)}</td>
                <td>{formatDate(game.releaseDate)}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Edit ${game.name}`}
                      title="Edit"
                      disabled={isLoading || isDeleting}
                      onClick={() => onEdit(game.id)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="m4 13.7-.7 3 3-.7 8.6-8.6-2.3-2.3L4 13.7Zm12-7.4.6-.6a1.6 1.6 0 0 0-2.3-2.3l-.6.6L16 6.3Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="icon-button danger"
                      aria-label={`Delete ${game.name}`}
                      title="Delete"
                      disabled={isDeleting}
                      onClick={() => onDelete(game)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M7 3h6l1 2h3v2H3V5h3l1-2Zm-1 6h2v7H6V9Zm4 0h2v7h-2V9Zm4 0h2v7h-2V9Z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
