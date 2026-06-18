import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackNavigation } from '../utils/analytics.js'

const ROUTE_NAMES = {
  '/login': 'Login',
  '/register': 'Registro',
  '/client': 'Cliente - Inicio',
  '/client/search': 'Cliente - Buscar servicios',
  '/client/requests': 'Cliente - Solicitudes',
  '/client/messages': 'Cliente - Mensajes',
  '/client/favorites': 'Cliente - Favoritos',
  '/client/profile': 'Cliente - Perfil',
  '/provider': 'Prestador - Inicio',
  '/provider/requests': 'Prestador - Solicitudes',
  '/provider/jobs': 'Prestador - Trabajos',
  '/provider/messages': 'Prestador - Mensajes',
  '/provider/profile': 'Prestador - Perfil',
  '/provider/calendar': 'Prestador - Calendario',
  '/provider/earnings': 'Prestador - Ganancias',
  '/provider/reviews': 'Prestador - Reseñas',
  '/provider/services': 'Prestador - Servicios',
}

export function useNavigationTracking() {
  const location = useLocation()

  useEffect(() => {
    trackNavigation({
      pathname: location.pathname,
      viewName: ROUTE_NAMES[location.pathname] || 'Ruta no catalogada',
    })
  }, [location.pathname])
}
