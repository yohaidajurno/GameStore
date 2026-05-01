const currencyFormatter = new Intl.NumberFormat(undefined, {
  currency: 'USD',
  style: 'currency',
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatDate(value) {
  if (!value) {
    return 'Not set'
  }

  return dateFormatter.format(new Date(`${value}T00:00:00`))
}
