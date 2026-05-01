export default function EmptyState({ action, description, title }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 5h14v14H5V5Zm2 2v10h10V7H7Zm2 2h6v2H9V9Zm0 4h4v2H9v-2Z" />
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}
