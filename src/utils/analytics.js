import { datadogRum, isDatadogReady } from '../config/datadog.js'

const REDACTED = '[REDACTED]'
const SENSITIVE_KEYS = [
  'authorization',
  'correo',
  'email',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'telefono',
  'phone',
  'direccion',
  'address',
]

function isSensitiveKey(key) {
  return SENSITIVE_KEYS.some((sensitive) =>
    String(key).toLowerCase().includes(sensitive),
  )
}

export function sanitizeContext(value) {
  if (Array.isArray(value)) return value.map((item) => sanitizeContext(item))
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      isSensitiveKey(key) ? REDACTED : sanitizeContext(item),
    ]),
  )
}

export function trackAction(name, context = {}) {
  if (!isDatadogReady()) return

  datadogRum.addAction(name, {
    ...sanitizeContext(context),
    loggedAt: new Date().toISOString(),
  })
}

export function trackError(error, context = {}) {
  if (!isDatadogReady()) return

  const normalizedError =
    error instanceof Error ? error : new Error(String(error || 'Error inesperado'))

  datadogRum.addError(normalizedError, sanitizeContext(context))
}

export function trackNavigation(context) {
  trackAction('navigation.viewed', context)
}

export function trackApiRequest({ method, endpoint, timestamp }) {
  trackAction('api.request', { method, endpoint, timestamp })
}

export function trackApiResponse({ method, endpoint, status, durationMs }) {
  trackAction('api.response', { method, endpoint, status, durationMs })
}

export function trackApiError({ method, endpoint, status, message, durationMs, error }) {
  trackAction('api.error', { method, endpoint, status, message, durationMs })
  trackError(error || new Error(message || 'Error API'), {
    type: 'api_error',
    method,
    endpoint,
    status,
    durationMs,
  })
}

export function trackNetworkFailure({ method, endpoint, message, error }) {
  trackAction('network.failure', { method, endpoint, message })
  trackError(error || new Error(message || 'Fallo de red'), {
    type: 'network_failure',
    method,
    endpoint,
  })
}

export function trackLogin(user) {
  trackAction('auth.login', { userId: user?.id, role: user?.rol })
}

export function trackRegister(role) {
  trackAction('auth.register', { role })
}

export function trackLogout(user) {
  trackAction('auth.logout', { userId: user?.id, role: user?.rol })
}

export function trackTokenExpired(endpoint) {
  trackAction('auth.token_expired', { endpoint })
}

export function trackAccessDenied(endpoint) {
  trackAction('auth.access_denied', { endpoint })
}

export function trackServiceRequest(context) {
  trackAction('client.service_request.created', context)
}

export function trackFavoriteAdded(context) {
  trackAction('client.favorite.added', context)
}

export function trackReviewSubmitted(context) {
  trackAction('client.review.submitted', context)
}

export function trackProviderAcceptedRequest(context) {
  trackAction('provider.request.accepted', context)
}

export function trackProviderRejectedRequest(context) {
  trackAction('provider.request.rejected', context)
}

export function trackProviderProfileUpdated(context) {
  trackAction('provider.profile.updated', context)
}

export function trackUnexpectedError(error, context = {}) {
  trackAction('system.unexpected_error', context)
  trackError(error, { type: 'unexpected_error', ...context })
}
