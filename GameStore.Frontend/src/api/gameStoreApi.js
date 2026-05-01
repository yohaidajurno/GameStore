const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5144'
).replace(/\/$/, '')

async function getErrorMessage(response) {
  const fallback = `Request failed with status ${response.status}`
  const contentType = response.headers.get('content-type') ?? ''

  try {
    if (contentType.includes('application/json')) {
      const body = await response.json()

      if (body.errors) {
        return Object.values(body.errors).flat().join(' ')
      }

      return body.detail ?? body.title ?? fallback
    }

    const text = await response.text()
    return text || fallback
  } catch {
    return fallback
  }
}

async function request(path, options = {}) {
  const { headers, body, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    body,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getGames(options) {
  return request('/games', options)
}

export function getGame(id, options) {
  return request(`/games/${id}`, options)
}

export function getGenres(options) {
  return request('/genres', options)
}

export function createGame(game, options) {
  return request('/games', {
    ...options,
    method: 'POST',
    body: JSON.stringify(game),
  })
}

export function updateGame(id, game, options) {
  return request(`/games/${id}`, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(game),
  })
}

export function deleteGame(id, options) {
  return request(`/games/${id}`, {
    ...options,
    method: 'DELETE',
  })
}
