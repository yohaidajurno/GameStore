import { formatCurrency, formatDate } from '../utils/formatters'

function getPosterTone(index) {
  const tones = ['amber', 'blue', 'green', 'rose', 'violet', 'slate']
  return tones[index % tones.length]
}

export default function GameCatalog({ games, onSelect, selectedGameId }) {
  return (
    <div className="catalog-grid">
      {games.map((game, index) => {
        const isSelected = game.id === selectedGameId

        return (
          <button
            key={game.id}
            type="button"
            className={`title-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(game.id)}
            aria-pressed={isSelected}
          >
            <span className={`poster poster-${getPosterTone(index)}`}>
              <span>{game.name.slice(0, 1)}</span>
            </span>
            <span className="title-card-body">
              <span className="title-card-name">{game.name}</span>
              <span className="title-card-meta">
                {game.genre} • {formatDate(game.releaseDate)}
              </span>
              <span className="title-card-price">{formatCurrency(game.price)}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
