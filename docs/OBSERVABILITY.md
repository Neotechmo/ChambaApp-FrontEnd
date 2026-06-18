# Observabilidad y Logging - ChambaApp Frontend

Este documento describe la integración de observabilidad del frontend de ChambaApp con Datadog RUM. La implementación está orientada a producción, auditoría académica y diagnóstico de errores de usuario.

## Objetivo

La solución permite monitorear:

- Errores de React capturados por `ErrorBoundary`.
- Errores inesperados de JavaScript enviados a Datadog RUM.
- Navegación de usuarios entre rutas principales.
- Interacciones de usuario capturadas automáticamente por Datadog.
- Recursos, long tasks y performance del navegador.
- Fallos de API, duración de peticiones y códigos HTTP.
- Eventos críticos de negocio de cliente y prestador.
- Session Replay con inputs enmascarados.

## Archivos implementados

| Archivo | Responsabilidad |
| --- | --- |
| `src/config/datadog.js` | Inicializa Datadog RUM con variables `VITE_DATADOG_*` y gestiona usuario seguro |
| `src/utils/analytics.js` | API interna para registrar acciones, errores y eventos de negocio |
| `src/hooks/useNavigationTracking.js` | Registra navegación por React Router |
| `src/components/ErrorBoundary.jsx` | Captura errores globales de React y los reporta a Datadog |
| `src/services/api.js` | Registra request, response, duración, errores HTTP y fallos de red |
| `.env.example` | Lista variables requeridas para Datadog y API |

## Variables de entorno

Configurar en Vercel o `.env.local`:

```env
VITE_API_URL=https://api.example.com/api
VITE_DATADOG_APPLICATION_ID=
VITE_DATADOG_CLIENT_TOKEN=
VITE_DATADOG_SITE=datadoghq.com
VITE_DATADOG_SERVICE=chambaapp-frontend
VITE_DATADOG_ENV=production
```

Notas:

- `VITE_DATADOG_APPLICATION_ID`, `VITE_DATADOG_CLIENT_TOKEN` y `VITE_DATADOG_SITE` son obligatorias para iniciar RUM.
- Las credenciales se leen desde ambiente y nunca se hardcodean.
- En producción, si faltan variables, la app sigue funcionando y muestra un warning controlado.

## Configuración RUM

La inicialización ocurre en `src/main.jsx` usando `initDatadogRum()`.

Configuración aplicada:

| Opción | Valor |
| --- | --- |
| `trackUserInteractions` | `true` |
| `trackResources` | `true` |
| `trackLongTasks` | `true` |
| `trackViewsManually` | `false` |
| `sessionSampleRate` | `100` |
| `sessionReplaySampleRate` | `100` |
| `defaultPrivacyLevel` | `mask-user-input` |

También se ejecuta:

```js
datadogRum.startSessionReplayRecording()
```

## Seguridad y privacidad

La capa `src/utils/analytics.js` sanitiza contexto antes de enviarlo a Datadog.

Nunca se registran:

- Passwords.
- JWT completos.
- Refresh tokens.
- Correos.
- Teléfonos.
- Direcciones.
- Headers de autorización.

Si una llave sensible aparece en el contexto, se reemplaza por:

```text
[REDACTED]
```

Además, `setDatadogUser()` sólo envía:

```js
{
  id: String(user.id),
  role: user.rol
}
```

No se envía nombre, correo ni teléfono.

## Eventos registrados

### Autenticación

| Evento Datadog | Cuándo ocurre |
| --- | --- |
| `auth.register` | Usuario crea cuenta |
| `auth.login` | Usuario inicia sesión correctamente |
| `auth.logout` | Usuario cierra sesión |
| `auth.token_expired` | API responde `401` en rutas protegidas |
| `auth.access_denied` | API responde `403` |

### Cliente

| Evento Datadog | Cuándo ocurre |
| --- | --- |
| `client.service_request.created` | Cliente solicita un servicio |
| `client.favorite.added` | Cliente agrega prestador a favoritos |
| `client.review.submitted` | Cliente envía una reseña |

### Prestador

| Evento Datadog | Cuándo ocurre |
| --- | --- |
| `provider.request.accepted` | Prestador acepta solicitud |
| `provider.request.rejected` | Prestador rechaza solicitud |
| `provider.profile.updated` | Prestador actualiza perfil profesional |

### Sistema

| Evento Datadog | Cuándo ocurre |
| --- | --- |
| `navigation.viewed` | Cambio de ruta en React Router |
| `api.request` | Inicio de una petición HTTP |
| `api.response` | Respuesta HTTP exitosa |
| `api.error` | Respuesta HTTP no exitosa |
| `network.failure` | Fallo de red o backend inaccesible |
| `system.unexpected_error` | Error capturado por `ErrorBoundary` |

## Logging de API

El proyecto no usa Axios; centraliza HTTP con `fetch` en `src/services/api.js`. Por eso la instrumentación equivalente a interceptores vive en `apiRequest()`.

Por cada request se registra:

| Campo | Descripción |
| --- | --- |
| `method` | Método HTTP normalizado |
| `endpoint` | Ruta relativa del backend |
| `timestamp` | Fecha ISO de inicio |

Por cada response exitosa se registra:

| Campo | Descripción |
| --- | --- |
| `method` | Método HTTP |
| `endpoint` | Ruta relativa |
| `status` | Código HTTP |
| `durationMs` | Duración de la petición |

Por cada error se registra:

| Campo | Descripción |
| --- | --- |
| `method` | Método HTTP |
| `endpoint` | Ruta relativa |
| `status` | Código HTTP si existe |
| `message` | Mensaje normalizado |
| `durationMs` | Duración hasta fallo |
| `stack` | Stack trace mediante `datadogRum.addError()` |

## Navegación

`src/hooks/useNavigationTracking.js` registra navegación con `navigation.viewed`.

Rutas catalogadas:

| Ruta | Vista |
| --- | --- |
| `/login` | Login |
| `/register` | Registro |
| `/client` | Cliente - Inicio |
| `/client/search` | Cliente - Buscar servicios |
| `/client/messages` | Cliente - Mensajes |
| `/client/favorites` | Cliente - Favoritos |
| `/client/profile` | Cliente - Perfil |
| `/provider` | Prestador - Inicio |
| `/provider/profile` | Prestador - Perfil |
| `/provider/calendar` | Prestador - Calendario |

Datadog RUM también captura vistas automáticamente porque `trackViewsManually` está en `false`.

## Cómo consultar en Datadog

### Errores frontend

1. Abrir Datadog.
2. Ir a **RUM > Error Tracking**.
3. Filtrar:

```text
service:chambaapp-frontend env:production
```

4. Revisar stack trace, navegador, URL y session replay.

### Eventos de usuario

1. Ir a **RUM > Explorer**.
2. Buscar acciones:

```text
@type:action service:chambaapp-frontend
```

3. Filtrar eventos de negocio:

```text
@action.name:client.service_request.created
@action.name:provider.request.accepted
@action.name:auth.login
```

### Fallos de API

Buscar:

```text
@action.name:api.error
```

Campos útiles:

- `@context.endpoint`
- `@context.status`
- `@context.durationMs`

### Session Replay

1. Entrar a una sesión en RUM Explorer.
2. Abrir **Session Replay**.
3. Ver el flujo del usuario con inputs enmascarados por `mask-user-input`.

## Uso para auditoría

La auditoría puede responder preguntas como:

- Cuándo inició sesión un usuario.
- Qué ruta visitó antes de un error.
- Si intentó crear una solicitud.
- Si una petición falló por `401`, `403`, `500` o fallo de red.
- Si un prestador aceptó o rechazó una solicitud.
- Si el frontend tuvo errores React no controlados.

## Ejemplos de uso en código

### Login

`App.jsx` llama:

```js
trackLogin(data.user)
setDatadogUser(data.user)
```

### Logout

`App.jsx` llama:

```js
trackLogout(user)
clearDatadogUser()
```

### Solicitud de servicio

`RequestServiceModal.jsx` llama:

```js
trackServiceRequest({
  requestId: request.id,
  serviceId: service.id,
  priority: form.prioridad,
  hasSavedAddress: Boolean(selectedAddress),
})
```

### Prestador acepta solicitud

`ProviderRequestsPage.jsx` llama:

```js
trackProviderAcceptedRequest({ requestId: id })
```

## Cómo demostrarlo en una presentación

1. Configurar variables `VITE_DATADOG_*` en `.env.local` o Vercel.
2. Ejecutar el frontend:

```bash
npm run dev
```

3. Iniciar sesión como cliente.
4. Navegar a búsqueda, favoritos y solicitudes.
5. Solicitar un servicio.
6. En Datadog RUM Explorer, buscar:

```text
@action.name:auth.login OR @action.name:client.service_request.created
```

7. Forzar un error de API apagando el backend y volver a cargar una pantalla.
8. Buscar:

```text
@action.name:network.failure
```

9. Mostrar que los inputs están enmascarados en Session Replay.
10. Mostrar que no aparecen password, JWT, correo, teléfono ni dirección en los eventos.

## Beneficios para calidad de software

- Permite detectar errores reales de usuarios sin depender de reportes manuales.
- Relaciona fallos de API con pantalla, ruta y sesión.
- Facilita reproducir problemas con Session Replay.
- Mejora trazabilidad de eventos críticos.
- Aporta evidencia técnica para auditoría y evaluación académica.
- Prepara el frontend para operación productiva en Vercel.
