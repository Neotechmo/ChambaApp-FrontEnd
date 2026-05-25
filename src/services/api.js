const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('chamba_token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Ocurrió un error en la petición'
    throw new Error(message)
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
}

export const servicesApi = {
  getAll: () => apiRequest('/services'),
  getById: (id) => apiRequest(`/services/${id}`),
}
