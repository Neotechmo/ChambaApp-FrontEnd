export function money(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function dateTime(value) {
  if (!value) return 'Por confirmar'

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function shortDate(value) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

export function statusLabel(status) {
  return {
    pending: 'Pendiente',
    accepted: 'Confirmado',
    on_the_way: 'En camino',
    in_progress: 'En proceso',
    completed: 'Completado',
    cancelled: 'Cancelado',
    rejected: 'Rechazado',
  }[status] || status
}

export function statusClass(status) {
  if (status === 'completed') return 'completed'
  if (status === 'pending') return 'pending'
  return 'active'
}

export function jobStatusClass(status) {
  return {
    accepted: 'pendiente',
    on_the_way: 'en-camino',
    in_progress: 'trabajando',
    completed: 'trabajando',
  }[status] || 'pendiente'
}

export function jobProgress(status) {
  return {
    accepted: 0,
    on_the_way: 30,
    in_progress: 65,
    completed: 100,
  }[status] ?? 0
}

export function addressText(address) {
  if (!address) return 'Ubicación disponible al confirmar'
  if (typeof address === 'string') return address
  return [address.street, address.city, address.state].filter(Boolean).join(', ')
}
