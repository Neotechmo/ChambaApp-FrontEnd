import {
  trackAccessDenied,
  trackApiError,
  trackApiRequest,
  trackApiResponse,
  trackNetworkFailure,
  trackTokenExpired,
} from '../utils/analytics.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const responseCache = new Map()
const pendingRequests = new Map()

function requestMethod(options) {
  return (options.method || 'GET').toUpperCase()
}

function cacheKey(path) {
  const token = localStorage.getItem('chamba_token') || 'anonymous'
  return `${token}:${path}`
}

function clearReadCache() {
  responseCache.clear()
}

export async function apiRequest(path, options = {}) {
  const method = requestMethod(options)
  const key = method === 'GET' ? cacheKey(path) : null
  if (key && pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }

  const request = executeRequest(path, options, method, key)
  if (key) {
    pendingRequests.set(key, request)
  }

  try {
    return await request
  } finally {
    if (key) pendingRequests.delete(key)
  }
}

async function executeRequest(path, options, method, key) {
  const token = localStorage.getItem('chamba_token')
  const startedAt = performance.now()
  const timestamp = new Date().toISOString()

  trackApiRequest({ method, endpoint: path, timestamp })

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (error) {
    trackNetworkFailure({
      method,
      endpoint: path,
      message: error.message,
      error,
    })
    throw error
  }

  const durationMs = Math.round(performance.now() - startedAt)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Ocurrió un error en la petición'
    const error = new Error(message)

    trackApiError({
      method,
      endpoint: path,
      status: response.status,
      message,
      durationMs,
      error,
    })

    if (response.status === 401 && path !== '/auth/login') {
      trackTokenExpired(path)
    }

    if (response.status === 403) {
      trackAccessDenied(path)
    }

    throw error
  }

  trackApiResponse({
    method,
    endpoint: path,
    status: response.status,
    durationMs,
  })

  if (key) {
    const signature = JSON.stringify(data)
    const cached = responseCache.get(key)

    if (cached?.signature === signature) {
      return cached.data
    }

    responseCache.set(key, { signature, data })
  } else if (method !== 'GET') {
    clearReadCache()
  }

  return data
}

export const authApi = {
  login: ({ correo, password }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    }),

  register: ({ nombre, apellido, correo, password, telefono, rol }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, apellido, correo, password, telefono, rol }),
    }),

  profile: () => apiRequest('/users/profile'),
  updateProfile: (profile) =>
    apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    }),
}

export const servicesApi = {
  getAll: (filters = {}) => apiRequest(`/services${queryString(filters)}`),
  getById: (id) => apiRequest(`/services/${id}`),
  create: (service) =>
    apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
  update: (id, service) =>
    apiRequest(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(service),
    }),
  remove: (id) => apiRequest(`/services/${id}`, { method: 'DELETE' }),
}

export const categoriesApi = {
  getAll: () => apiRequest('/categories'),
}

export const dashboardApi = {
  client: () => apiRequest('/dashboard/client'),
  provider: () => apiRequest('/dashboard/provider'),
}

export const requestsApi = {
  mine: () => apiRequest('/requests/mine'),
  create: (request) =>
    apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  cancel: (id) => apiRequest(`/requests/${id}/cancel`, { method: 'PATCH' }),
  reschedule: (id, schedule) =>
    apiRequest(`/requests/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(schedule),
    }),
  acceptDate: (id) =>
    apiRequest(`/requests/${id}/accept-date`, { method: 'PATCH' }),
  review: (id, review) =>
    apiRequest(`/requests/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),
}

export const providerApi = {
  dashboard: () => dashboardApi.provider(),
  requests: () => apiRequest('/provider/requests'),
  acceptRequest: (id) =>
    apiRequest(`/provider/requests/${id}/accept`, { method: 'PATCH' }),
  rejectRequest: (id, motivo) =>
    apiRequest(`/provider/requests/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    }),
  proposeDate: (id, fechaPropuesta) =>
    apiRequest(`/provider/requests/${id}/propose-date`, {
      method: 'PATCH',
      body: JSON.stringify({ fechaPropuesta }),
    }),
  jobs: () => apiRequest('/provider/jobs'),
  updateJobStatus: (id, status) =>
    apiRequest(`/provider/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  calendar: () => apiRequest('/provider/calendar'),
  earnings: (filters = {}) =>
    apiRequest(`/provider/earnings/summary${queryString(filters)}`),
  transactions: () => apiRequest('/provider/transactions'),
  reviews: () => apiRequest('/provider/reviews/summary'),
  updateProfile: (profile) =>
    apiRequest('/providers/profile', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    }),
  updateAvailability: (disponible) =>
    apiRequest('/provider/availability', {
      method: 'PATCH',
      body: JSON.stringify({ disponible }),
    }),
}

export const favoritesApi = {
  getAll: () => apiRequest('/favorites'),
  add: (providerId) =>
    apiRequest(`/favorites/${providerId}`, { method: 'POST' }),
  remove: (providerId) =>
    apiRequest(`/favorites/${providerId}`, { method: 'DELETE' }),
}

export const conversationsApi = {
  getAll: () => apiRequest('/conversations'),
  messages: (id) => apiRequest(`/conversations/${id}/messages`),
  send: (id, text) =>
    apiRequest(`/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  read: (id) =>
    apiRequest(`/conversations/${id}/read`, { method: 'PATCH' }),
}

export const notificationsApi = {
  getAll: () => apiRequest('/notifications'),
  read: (id) =>
    apiRequest(`/notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true }),
    }),
}

export const paymentsApi = {
  forRequest: (requestId) => apiRequest(`/requests/${requestId}/payment`),
  createForRequest: (requestId, payment) =>
    apiRequest(`/requests/${requestId}/payment`, {
      method: 'POST',
      body: JSON.stringify(payment),
    }),
  confirm: (requestId) =>
    apiRequest(`/requests/${requestId}/payment/confirm`, { method: 'PATCH' }),
}

export const addressesApi = {
  getAll: () => apiRequest('/addresses'),
  create: (address) =>
    apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  update: (id, address) =>
    apiRequest(`/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(address),
    }),
}

export const ratingsApi = {
  getAll: () => apiRequest('/calificaciones'),
}

function queryString(filters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}
