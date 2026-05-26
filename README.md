# ChambaApp Frontend

Interfaz web de ChambaApp, una plataforma de contratación de servicios para conectar clientes con prestadores, agendar visitas, coordinar el trabajo, conversar, registrar pagos simulados y calificar servicios finalizados.

> Este repositorio contiene la aplicación frontend React/Vite. El sistema funcional depende del repositorio hermano `chabaapp-backend`, una API NestJS localizada durante el desarrollo en `../chabaapp-backend`. Este documento describe la solución integrada porque el frontend consume directamente su contrato REST y sus modelos de negocio.

## Tabla de contenidos

1. [Propósito y alcance](#1-propósito-y-alcance)
2. [Características principales](#2-características-principales)
3. [Tecnologías utilizadas](#3-tecnologías-utilizadas)
4. [Arquitectura general](#4-arquitectura-general)
5. [Diagramas de arquitectura](#5-diagramas-de-arquitectura)
6. [Flujo de datos](#6-flujo-de-datos)
7. [Estructura del proyecto](#7-estructura-del-proyecto)
8. [Módulos del sistema](#8-módulos-del-sistema)
9. [Base de datos](#9-base-de-datos)
10. [Modelo relacional](#10-modelo-relacional)
11. [API REST y WebSocket](#11-api-rest-y-websocket)
12. [Variables de entorno](#12-variables-de-entorno)
13. [Instalación local](#13-instalación-local)
14. [Docker y despliegue](#14-docker-y-despliegue)
15. [Pipeline CI/CD](#15-pipeline-cicd)
16. [Seguridad](#16-seguridad)
17. [Manejo de errores y observabilidad](#17-manejo-de-errores-y-observabilidad)
18. [Estrategia de testing](#18-estrategia-de-testing)
19. [Escalabilidad](#19-escalabilidad)
20. [Decisiones arquitectónicas](#20-decisiones-arquitectónicas)
21. [Roadmap](#21-roadmap)
22. [Contribución](#22-contribución)
23. [Licencia](#23-licencia)

## 1. Propósito y alcance

### Nombre del proyecto

**ChambaApp Frontend**
Aplicación SPA para clientes y prestadores de servicios locales.

### Objetivo principal

Facilitar el ciclo completo de una contratación:

1. El cliente descubre servicios disponibles.
2. Agenda una visita en una dirección y fecha específicas.
3. El prestador acepta, rechaza o propone otra fecha.
4. Las partes conversan y siguen el avance del trabajo.
5. El cliente registra y confirma un pago simulado.
6. El cliente califica una sola vez el servicio completado.

### Problema que resuelve

La contratación informal de oficios suele dispersar información entre mensajes, llamadas y acuerdos no rastreables. ChambaApp centraliza catálogo, agenda, solicitudes, seguimiento, pagos, conversación y reputación en una experiencia separada por rol.

### Alcance de los repositorios

| Componente | Repositorio / ubicación de desarrollo | Responsabilidad |
| --- | --- | --- |
| Frontend | `ChambaApp-FrontEnd/` | SPA React, rutas, estado de sesión, interacción del cliente y prestador |
| Backend | `../chabaapp-backend/` | API REST NestJS, Socket.IO, autenticación, reglas de negocio y persistencia |
| PostgreSQL | Administrado por backend | Datos relacionales: usuarios, servicios, solicitudes, pagos, reseñas |
| MongoDB | Administrado por backend | Chats, notificaciones y logs |

### Estado de implementación verificado

| Capacidad | Estado | Nota |
| --- | --- | --- |
| Portales cliente y prestador | Implementado | Rutas protegidas por sesión en frontend |
| API REST integrada | Implementado | `src/services/api.js` |
| Chat en UI | Implementado por polling REST | El backend además ofrece Socket.IO autenticado; la UI actual sondea conversaciones |
| Agenda y prevención de traslapes | Implementado en backend | Conflicto `SCHEDULE_CONFLICT` al aceptar |
| Pagos | Implementado como simulación académica | No procesa tarjetas ni dinero real |
| Calificación única por solicitud | Implementado | Restricción backend y bloqueo visual frontend |
| Docker frontend | No implementado en este repositorio | Backend sí contiene `Dockerfile` y Compose |
| CI/CD versionado | No implementado | Se documenta pipeline recomendado |

## 2. Características principales

### Experiencia del cliente

- Registro e inicio de sesión con rol `cliente`.
- Dashboard con solicitudes activas, favoritos, servicios completados y gasto mensual pagado.
- Catálogo de servicios con búsqueda, categorías, disponibilidad y ordenamiento.
- Gestión de prestadores favoritos.
- Solicitud de servicio con fecha, duración, prioridad y dirección escrita o guardada.
- Consulta del historial de solicitudes y estados de ejecución.
- Reprogramación de solicitudes pendientes.
- Aceptación de una fecha alternativa propuesta por el prestador.
- Pago simulado en dos pasos: registro y confirmación.
- Calificación de servicios completados, limitada a una reseña por solicitud.
- Conversación vinculada a cada solicitud y actualización periódica de mensajes.
- Gestión de perfil y direcciones personales.

### Experiencia del prestador

- Registro e inicio de sesión con rol `prestador`.
- Dashboard con solicitudes pendientes, trabajos activos, reputación y ganancias pagadas.
- Cambio de disponibilidad pública.
- Bandeja de solicitudes con fecha solicitada.
- Aceptación, rechazo con motivo o propuesta de una nueva fecha.
- Gestión del avance: aceptado, en camino, en progreso y completado.
- Calendario basado en trabajos aceptados.
- Consulta de pagos confirmados y ganancias.
- Consulta de reseñas y distribución de puntuaciones.
- Publicación, edición, activación, pausa y eliminación de servicios.
- Conversación y notificaciones.
- Actualización del perfil profesional.

### Plataforma y backend

- Autenticación JWT.
- Hash de contraseñas con `bcrypt`.
- Roles `admin`, `cliente` y `prestador`.
- Validación global de DTOs con `class-validator` y `ValidationPipe`.
- Persistencia relacional con PostgreSQL y Prisma.
- Persistencia documental para chat, logs y notificaciones con MongoDB/Mongoose.
- API REST con prefijo `/api`.
- Canal Socket.IO `/chat` autenticado por JWT.
- Bloqueo transaccional de agenda al aceptar solicitudes.
- Cálculo de pagos en backend para evitar montos manipulados en el cliente.
- Seeds de desarrollo para los tres roles.

## 3. Tecnologías utilizadas

### Frontend

| Tecnología | Versión declarada | Uso |
| --- | ---: | --- |
| Node.js | No fijada en frontend | Runtime requerido para tooling; usar Node.js 20+ o 22 LTS |
| React | `19.2.4` | Componentes y manejo de estado de interfaz |
| React DOM | `19.2.4` | Renderizado de la SPA |
| React Router DOM | `^7.15.1` | Rutas y layouts por rol |
| React Icons | `^5.6.0` | Iconografía de interfaz |
| Vite | `^8.0.1` | Servidor de desarrollo y build estático |
| ESLint | `^9.39.4` | Análisis estático del frontend |
| CSS modular por archivos | N/A | Diseño responsive y temas claro/oscuro |

### Backend integrado

| Tecnología | Versión declarada | Uso |
| --- | ---: | --- |
| Node.js | `22-alpine` en Dockerfile | Runtime de producción del backend |
| NestJS | `^11.0.1` | Framework de API modular |
| TypeScript | `^5.7.3` | Código tipado de backend |
| PostgreSQL | `16` en Compose | Persistencia transaccional de negocio |
| Prisma Client / Prisma | `^6.19.3` | ORM, esquema y migraciones |
| MongoDB | Servicio externo o local | Mensajes, notificaciones y logs |
| Mongoose | `^9.6.2` | ODM para colecciones MongoDB |
| Passport JWT | `^4.0.1` | Autenticación de rutas protegidas |
| bcrypt | `^6.0.0` | Hash seguro de contraseñas |
| Socket.IO | `^4.8.3` | Eventos de conversación y operación |
| Jest | `^30.0.0` | Pruebas unitarias y de servicios |
| Docker | Imagen Node/Postgres | Empaquetado y arranque backend |

### Dependencias externas y supuestos

| Recurso | Requerido por | Estado |
| --- | --- | --- |
| API backend `http://localhost:3000/api` | Frontend local por defecto | Requerido |
| MongoDB (`MONGODB_URI` o `MONGO_URI`) | Chat/notificaciones/logs backend | Requerido para backend completo |
| PostgreSQL (`DATABASE_URL`) | Dominio transaccional backend | Requerido |
| Procesador de pago real | Cobro monetario | No integrado; el flujo es simulado |

## 4. Arquitectura general

### Estilo arquitectónico

ChambaApp se compone de una SPA frontend y un backend modular desplegable como monolito. No es una arquitectura de microservicios: los módulos NestJS comparten proceso, configuración y acceso a persistencias, aunque separan responsabilidades de dominio.

La persistencia es híbrida:

- PostgreSQL conserva información que exige integridad y relaciones: identidad, catálogo, solicitudes, agenda, pagos y calificaciones.
- MongoDB conserva datos de interacción/eventos: mensajes, notificaciones y logs.

### Capas del frontend

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| Arranque | `src/main.jsx`, `src/App.jsx` | Montaje React, sesión, tema y árbol de rutas |
| Presentación | `src/pages/`, `src/layouts/` | Vistas, formularios, modales y navegación por rol |
| Integración HTTP | `src/services/api.js` | Cliente `fetch`, bearer token y contratos REST |
| Presentación transversal | `src/styles/` | Tokens visuales, layouts, estados y responsive |
| Utilidades | `src/utils/formatters.js` | Formato de moneda, fecha, dirección y estados |
| Estado local | Componentes y `localStorage` | Usuario, token JWT, tema y estados temporales |

### Capas del backend

| Capa | Ubicación backend | Responsabilidad |
| --- | --- | --- |
| Entrada HTTP / eventos | `src/*/*.controller.ts`, `src/chats/chats.gateway.ts` | Rutas REST, guards, eventos Socket.IO |
| Aplicación / negocio | `src/*/*.service.ts` | Reglas de agenda, pagos, permisos y mapeo de respuesta |
| Contratos | `src/*/dto/*.ts` | Validación y transformación de cuerpos/query |
| Persistencia relacional | `prisma/schema.prisma`, `src/prisma/` | Modelado y acceso PostgreSQL |
| Persistencia documental | `src/*/schemas/*.ts` | Schemas Mongoose para chat, avisos y logs |
| Seguridad | `src/auth/` | Registro, login, estrategia JWT y roles |

### Fronteras de responsabilidad

| Decisión | Responsable |
| --- | --- |
| Autenticar credenciales y firmar JWT | Backend |
| Conservar token y elegir panel según rol | Frontend |
| Validar propiedad de solicitudes, pagos y mensajes | Backend |
| Impedir doble reserva y doble calificación | Backend |
| Ocultar acciones inválidas y explicar estado al usuario | Frontend |
| Calcular monto pagable | Backend |
| Renderizar estadísticas y actualizar polling | Frontend |

## 5. Diagramas de arquitectura

### Vista de contenedores

```mermaid
flowchart LR
  U["Usuario web<br/>Cliente o prestador"] --> FE["ChambaApp Frontend<br/>React + Vite SPA"]
  FE -->|"REST JSON + Bearer JWT"| API["ChambaApp Backend<br/>NestJS monolito modular"]
  FE -.->|"Socket.IO disponible<br/>UI actual usa polling REST"| WS["Namespace /chat"]
  WS --> API
  API -->|"Prisma"| SQL[("PostgreSQL 16<br/>Datos de negocio")]
  API -->|"Mongoose"| MONGO[("MongoDB<br/>Chat, notificaciones, logs")]
```

### Componentes frontend

```mermaid
flowchart TB
  App["AppRoutes<br/>sesión y tema"] --> Public["Login / Registro"]
  App --> ClientLayout["ClientLayout"]
  App --> ProviderLayout["ProviderLayout"]
  ClientLayout --> ClientPages["Dashboard, búsqueda, solicitudes,<br/>mensajes, favoritos, perfil"]
  ProviderLayout --> ProviderPages["Dashboard, solicitudes, trabajos,<br/>calendario, pagos, reseñas, servicios, perfil"]
  ClientPages --> API["services/api.js"]
  ProviderPages --> API
  API --> Backend["API REST /api"]
  ClientLayout --> Poll["Polling avisos/mensajes"]
  ProviderLayout --> Poll
```

### Componentes backend

```mermaid
flowchart TB
  HTTP["Controllers REST"] --> Guards["JWT + RolesGuard + DTO Validation"]
  Socket["ChatsGateway Socket.IO"] --> JWT["Validación JWT socket"]
  Guards --> Services["Servicios de aplicación"]
  JWT --> Services
  Services --> Prisma["PrismaService"]
  Services --> Mongoose["Modelos Mongoose"]
  Prisma --> PG[("PostgreSQL")]
  Mongoose --> MG[("MongoDB")]
  Services --> Events["Eventos de usuario<br/>requestStatusChanged / paymentPaid"]
```

## 6. Flujo de datos

### Inicio de sesión y autorización

1. El formulario envía correo y contraseña a `POST /api/auth/login`.
2. El backend busca el usuario, valida estado activo y compara el hash con `bcrypt`.
3. El backend firma un JWT con `sub`, `correo` y `rol_id`.
4. El frontend conserva `access_token` y usuario en `localStorage`.
5. `apiRequest()` adjunta `Authorization: Bearer ACCESS_TOKEN` a solicitudes subsecuentes.
6. React enruta a `/client` o `/provider` de acuerdo con `user.rol`.

```mermaid
sequenceDiagram
  participant U as Usuario
  participant F as React SPA
  participant A as AuthController
  participant P as PostgreSQL
  U->>F: Correo y contraseña
  F->>A: POST /api/auth/login
  A->>P: Buscar usuario y rol
  P-->>A: Usuario + password_hash
  A->>A: bcrypt.compare y jwt.sign
  A-->>F: access_token + user
  F->>F: localStorage y redirección por rol
```

### Solicitud, agenda y negociación de fecha

1. El cliente selecciona un servicio y abre el modal de agenda.
2. Puede elegir una dirección guardada (`direccionId`) o escribir una dirección.
3. Envía fecha futura y duración a `POST /api/requests`.
4. El backend guarda la solicitud pendiente y notifica al prestador.
5. El prestador acepta, rechaza o propone fecha alternativa.
6. Al aceptar, el backend verifica traslapes de trabajos activos dentro de una transacción.
7. Si existe traslape, responde `409` con código `SCHEDULE_CONFLICT`.
8. Si no existe, la solicitud pasa a calendario/trabajos.

```mermaid
sequenceDiagram
  participant C as Cliente
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL
  participant P as Prestador
  C->>F: Selecciona servicio, fecha y dirección
  F->>B: POST /api/requests
  B->>DB: INSERT Solicitud pending
  B-->>P: Notificación de nueva solicitud
  P->>B: PATCH /api/provider/requests/:id/accept
  B->>DB: Lock + validar agenda activa
  alt Hay traslape
    B-->>F: 409 SCHEDULE_CONFLICT
  else Disponible
    B->>DB: estado = accepted
    B-->>C: Notificación de aceptación
  end
```

### Pago simulado

1. La UI habilita pago únicamente en solicitudes aceptadas, en curso o completadas.
2. El cliente envía método y referencia; no envía datos de tarjeta.
3. El backend calcula el monto desde precios persistidos, creando un pago `pending`.
4. El cliente confirma el intento mediante `PATCH /api/requests/:id/payment/confirm`.
5. El backend cambia estado a `paid`, registra `fecha_pago` y notifica al prestador.
6. Dashboard y ganancias sólo agregan pagos `paid`.

```mermaid
sequenceDiagram
  participant C as Cliente
  participant F as Frontend
  participant API as PagosService
  participant DB as PostgreSQL
  participant P as Prestador
  C->>F: Registrar pago
  F->>API: POST /api/requests/:id/payment
  API->>DB: Leer solicitud y calcular monto
  API->>DB: Crear Pago pending
  API-->>F: payment.status = pending
  C->>F: Confirmar pago
  F->>API: PATCH /api/requests/:id/payment/confirm
  API->>DB: estado = paid, fecha_pago = now
  API-->>P: paymentPaid / notificación
  API-->>F: payment.status = paid
```

### Mensajes y notificaciones

La UI actual obtiene conversaciones y mensajes mediante polling: layouts cada cuatro segundos y la conversación activa cada 2.5 segundos. El backend también implementa Socket.IO autenticado, disponible para una migración futura a actualizaciones push.

```mermaid
flowchart LR
  UI["Layouts / pantalla de mensajes"] -->|"GET /conversations<br/>GET /notifications"| API["Backend"]
  UI -->|"POST /conversations/:id/messages"| API
  API --> M[("MongoDB ChatMessage")]
  API --> N[("MongoDB Notification")]
  API -.->|"Socket.IO eventos disponibles"| SOCKET["/chat"]
```

## 7. Estructura del proyecto

### Repositorio frontend

```text
ChambaApp-FrontEnd/
├── index.html                    # Documento base de Vite
├── package.json                  # Scripts y dependencias frontend
├── vite.config.js                # Plugin React para Vite
├── eslint.config.js              # Reglas ESLint para JS/JSX
├── README.md                     # Documentación de arquitectura y operación
└── src/
    ├── main.jsx                  # Punto de entrada React
    ├── App.jsx                   # Sesión, tema y rutas
    ├── App.css                   # Índice de estilos importados
    ├── assets/                   # Recursos gráficos empacados
    ├── layouts/
    │   ├── ClientLayout.jsx      # Menú, badges y avisos de cliente
    │   └── ProviderLayout.jsx    # Menú, badges y avisos de prestador
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ClientHomePage.jsx
    │   ├── ProviderHomePage.jsx
    │   ├── client/
    │   │   ├── ClientSearchPage.jsx
    │   │   ├── ClientRequestsPage.jsx
    │   │   ├── ClientMessagesPage.jsx
    │   │   ├── ClientFavoritesPage.jsx
    │   │   ├── ClientProfilePage.jsx
    │   │   ├── RequestServiceModal.jsx
    │   │   ├── RequestDateModal.jsx
    │   │   ├── PaymentModal.jsx
    │   │   └── ReviewModal.jsx
    │   └── provider/
    │       ├── ProviderRequestsPage.jsx
    │       ├── ProviderJobsPage.jsx
    │       ├── ProviderCalendarPage.jsx
    │       ├── ProviderMessagesPage.jsx
    │       ├── ProviderEarningsPage.jsx
    │       ├── ProviderReviewsPage.jsx
    │       ├── ProviderServicesPage.jsx
    │       ├── ProviderProfilePage.jsx
    │       └── ProviderRequestModal.jsx
    ├── services/
    │   └── api.js                # Adaptadores REST del backend
    ├── styles/                   # Estilos por flujo y responsive
    └── utils/
        └── formatters.js         # Formateo de dominio para presentación
```

### Repositorio backend relacionado

```text
chabaapp-backend/
├── Dockerfile
├── docker-compose.yml
├── DOCUMENTACION_CONSUMO_API.md
├── package.json
├── prisma/
│   ├── schema.prisma             # Modelo relacional
│   ├── migrations/               # Evolución SQL
│   └── seed.ts                   # Roles y cuentas de prueba
├── test/
│   └── app.e2e-spec.ts
└── src/
    ├── main.ts                   # Bootstrap, CORS, prefix y ValidationPipe
    ├── app.module.ts             # Composición de módulos
    ├── auth/                     # Login, registro, JWT y roles
    ├── users/                    # Perfiles y disponibilidad
    ├── services/                 # Catálogo y categorías
    ├── addresses/                # Direcciones del usuario
    ├── solicitudes/              # Solicitudes, agenda y trabajos
    ├── pagos/                    # Pago simulado y confirmación
    ├── calificaciones/           # Reseñas y reputación
    ├── favorites/                # Prestadores favoritos
    ├── dashboard/                # Métricas y ganancias
    ├── chats/                    # REST, conversaciones y Socket.IO
    ├── notifications/            # Notificaciones MongoDB
    ├── logs/                     # Auditoría MongoDB administrativa
    └── prisma/                   # Servicio de acceso SQL
```

### Rutas de la SPA

| Ruta | Rol | Pantalla |
| --- | --- | --- |
| `/login` | Público | Autenticación |
| `/register` | Público | Creación de cuenta cliente/prestador |
| `/client` | Cliente autenticado | Dashboard cliente |
| `/client/search` | Cliente autenticado | Búsqueda y solicitud de servicios |
| `/client/requests` | Cliente autenticado | Solicitudes, pagos, agenda y reseñas |
| `/client/messages` | Cliente autenticado | Conversaciones |
| `/client/favorites` | Cliente autenticado | Prestadores favoritos |
| `/client/profile` | Cliente autenticado | Perfil y direcciones |
| `/provider` | Prestador autenticado | Dashboard profesional |
| `/provider/requests` | Prestador autenticado | Solicitudes por responder |
| `/provider/jobs` | Prestador autenticado | Seguimiento de trabajos |
| `/provider/calendar` | Prestador autenticado | Agenda |
| `/provider/messages` | Prestador autenticado | Conversaciones |
| `/provider/earnings` | Prestador autenticado | Ganancias y transacciones |
| `/provider/reviews` | Prestador autenticado | Reputación |
| `/provider/services` | Prestador autenticado | Administración de oferta |
| `/provider/profile` | Prestador autenticado | Perfil profesional |

## 8. Módulos del sistema

### Frontend: aplicación y sesión

**Responsabilidad:** iniciar la SPA, mantener el estado mínimo global y resolver navegación.

| Componente | Función |
| --- | --- |
| `App.jsx` | Lee/escribe sesión y tema en `localStorage`, ejecuta login/registro y declara rutas |
| `ClientLayout.jsx` | Menú de cliente, conteos activos y toasts de mensajes/notificaciones |
| `ProviderLayout.jsx` | Menú profesional, solicitudes pendientes y toasts |

**Flujo interno:** el usuario inicia sesión, `App` conserva JWT/usuario, la ruta anidada monta su layout y éste actualiza indicadores con polling.

### Frontend: cliente

| Componente | Contratos backend consumidos | Función |
| --- | --- | --- |
| `ClientHomePage` | `/dashboard/client`, `/categories`, `/users/profile`, `/services` | Resumen y servicios cercanos |
| `ClientSearchPage` | `/services`, `/categories`, `/favorites/:providerId` | Buscar, ordenar, guardar y solicitar |
| `RequestServiceModal` | `/addresses`, `/requests` | Agendar nueva solicitud |
| `ClientRequestsPage` | `/requests/mine`, `/calificaciones`, acciones de solicitud | Seguimiento y acciones |
| `RequestDateModal` | `/requests/:id/reschedule` | Reprogramación |
| `PaymentModal` | `/requests/:id/payment`, `/confirm` | Flujo de pago simulado |
| `ReviewModal` | `/requests/:id/review` | Calificación única |
| `ClientMessagesPage` | `/conversations` y mensajes | Chat por solicitud |
| `ClientFavoritesPage` | `/favorites` | Contratación recurrente |
| `ClientProfilePage` | `/users/profile`, `/addresses` | Datos personales y domicilios |

### Frontend: prestador

| Componente | Contratos backend consumidos | Función |
| --- | --- | --- |
| `ProviderHomePage` | `/dashboard/provider`, `/provider/requests`, `/provider/jobs` | Resumen operativo |
| `ProviderRequestsPage` | `/provider/requests/*` | Aceptar, rechazar o negociar fecha |
| `ProviderRequestModal` | `/provider/requests/:id/reject`, `/propose-date` | Acción con captura de datos |
| `ProviderJobsPage` | `/provider/jobs`, `/status` | Ejecutar transición de estados |
| `ProviderCalendarPage` | `/provider/calendar` | Consultar citas aceptadas |
| `ProviderMessagesPage` | `/conversations` | Chat por solicitud |
| `ProviderEarningsPage` | `/provider/earnings/summary`, `/transactions` | Pagos confirmados |
| `ProviderReviewsPage` | `/provider/reviews/summary` | Puntuación y comentarios |
| `ProviderServicesPage` | `/services` CRUD | Oferta publicada |
| `ProviderProfilePage` | `/users/profile`, `/providers/profile` | Datos profesionales |

**Limitación conocida:** el backend no ofrece `GET /api/provider/services`; la pantalla de servicios filtra temporalmente resultados del catálogo público. La especificación pendiente está descrita en `PROMT_FALTANTES.md`, archivo local ignorado por Git.

### Backend: autenticación y usuarios

**Componentes:** `AuthController`, `AuthService`, `JwtStrategy`, `RolesGuard`, `UsersController`, `UsersService`.

**Flujo interno:** el registro asigna rol público permitido y hashea contraseña; login verifica hash y genera token; guards validan identidad/rol para perfiles y operaciones protegidas.

### Backend: catálogo y favoritos

**Componentes:** `ServicesController/Service`, DTOs de servicio y consulta, `FavoritesController/Service`.

**Flujo interno:** el catálogo recupera servicios y sus prestadores/calificaciones mediante Prisma, calcula rating y distancia opcional; favoritos mantiene una relación única cliente-prestador.

### Backend: solicitudes, agenda y trabajos

**Componentes:** `RequestsController`, `ProviderRequestsController`, `SolicitudesService`, DTOs de creación, acciones y reprogramación.

**Flujo interno:** solicitudes nacen `pending`, almacenan fecha/duración, generan notificación y eventos; el prestador responde; la aceptación usa bloqueo transaccional y validación de rango horario; el avance transforma la solicitud en un trabajo operativo.

### Backend: pagos y dashboards

**Componentes:** `PagosController`, `RequestPaymentsController`, `PagosService`, `DashboardService`.

**Flujo interno:** el cliente registra pago en una solicitud elegible; el monto se calcula en servidor; la confirmación marca `paid`; sólo pagos pagados alimentan gasto del cliente y ganancias del prestador.

### Backend: reseñas

**Componentes:** `CalificacionesController`, `RequestReviewsController`, `ProviderPublicReviewsController`, `ProviderReviewSummaryController`, `CalificacionesService`.

**Flujo interno:** una solicitud completada puede originar una sola calificación debido a validación del servicio y restricción única de `solicitud_id`.

### Backend: interacción y auditoría

| Módulo | Persistencia | Responsabilidad |
| --- | --- | --- |
| `ChatsModule` | MongoDB | Mensajes REST, conversaciones normalizadas y Socket.IO |
| `NotificationsModule` | MongoDB | Alertas operativas con estado leído |
| `LogsModule` | MongoDB | Registro administrativo de acciones |

## 9. Base de datos

### PostgreSQL: entidades relacionales

#### `Role`

| Campo | Tipo | Restricción | Descripción |
| --- | --- | --- | --- |
| `id` | `Int` | PK, autoincrement | Identificador |
| `nombre` | `String` | Unique | `admin`, `cliente` o `prestador` |

#### `Usuario`

| Campo | Tipo | Restricción | Descripción |
| --- | --- | --- | --- |
| `id` | `Int` | PK, autoincrement | Identificador de usuario |
| `nombre` | `String` | Required | Nombre |
| `apellido` | `String?` | Optional | Apellido |
| `correo` | `String` | Unique | Credencial de acceso |
| `password_hash` | `String` | Required | Contraseña hasheada |
| `telefono` | `String?` | Optional | Teléfono de contacto |
| `foto_perfil` | `String?` | Optional | URL/avatar |
| `activo` | `Boolean` | Default `true` | Permite login |
| `verificado` | `Boolean` | Default `false` | Indicador de confianza |
| `fecha_registro` | `DateTime` | Default `now()` | Auditoría |
| `ciudad`, `estado` | `String?` | Optional | Ubicación textual |
| `lat`, `lng` | `Float?` | Optional | Geolocalización |
| `preferencias` | `Json?` | Optional | Preferencias UI |
| `especialidad` | `String?` | Optional | Perfil prestador |
| `descripcion_profesional` | `String?` | Optional | Perfil prestador |
| `experiencia_anios` | `Int?` | Optional | Perfil prestador |
| `precio_hora` | `Float?` | Optional | Perfil prestador |
| `zona_cobertura` | `String?` | Optional | Perfil prestador |
| `disponible` | `Boolean` | Default `true` | Visibilidad de atención |
| `etiquetas` | `String[]` | Default `[]` | Etiquetas profesionales |
| `rol_id` | `Int` | FK `Role` | Permisos del usuario |

#### `Categoria` y `Servicio`

| Entidad | Campo | Tipo | Descripción |
| --- | --- | --- | --- |
| `Categoria` | `id` | `Int` PK | Identificador |
| `Categoria` | `nombre` | `String` unique | Nombre de categoría |
| `Servicio` | `id` | `Int` PK | Identificador de publicación |
| `Servicio` | `titulo` | `String` | Nombre del servicio |
| `Servicio` | `descripcion` | `String` | Detalle de oferta |
| `Servicio` | `precio_base` | `Float` | Precio estimado base |
| `Servicio` | `disponible` | `Boolean` | Publicación activa |
| `Servicio` | `fecha_creacion` | `DateTime` | Fecha de alta |
| `Servicio` | `prestador_id` | `Int` FK | Dueño de publicación |
| `Servicio` | `categoria_id` | `Int?` FK | Clasificación opcional |

#### `Solicitud`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `Int` PK | Identificador de contratación |
| `titulo`, `descripcion` | `String?` | Necesidad expresada |
| `direccion_servicio` | `String?` | Dirección libre |
| `prioridad` | `String` | `normal` o `urgent` |
| `estado` | `String` | Estado de operación |
| `fecha_solicitud` | `DateTime` | Alta |
| `fecha_programada` | `DateTime?` | Visita acordada/solicitada |
| `fecha_propuesta` | `DateTime?` | Alternativa del prestador |
| `propuesta_pendiente` | `Boolean` | Requiere aceptación cliente |
| `duracion_estimada_min` | `Int?` | Bloque horario |
| `precio_estimado`, `precio_final` | `Float?` | Valores del trabajo |
| `cliente_id` | `Int` FK | Solicitante |
| `servicio_id` | `Int` FK | Publicación contratada |
| `direccion_id` | `Int?` FK | Dirección guardada utilizada |

Estados normalizados de solicitud:

| Estado | Significado | Acción posterior esperada |
| --- | --- | --- |
| `pending` | Pendiente de respuesta | Aceptar, rechazar, proponer fecha o cancelar |
| `accepted` | Cita confirmada | Prestador inicia traslado; cliente puede pagar |
| `on_the_way` | Prestador en camino | Iniciar trabajo |
| `in_progress` | Trabajo en ejecución | Completar |
| `completed` | Terminado | Pagar y calificar |
| `cancelled` | Cancelado por cliente | Terminal |
| `rejected` | Rechazado por prestador | Terminal |

#### `Direccion`, `Favorito`, `Pago` y `Calificacion`

| Entidad | Campos principales | Reglas de integridad |
| --- | --- | --- |
| `Direccion` | `calle`, `ciudad`, `estado`, `codigo_postal`, coordenadas, `usuario_id` | Sólo el propietario la administra |
| `Favorito` | `cliente_id`, `prestador_id`, `fecha_creacion` | Unique compuesto cliente-prestador |
| `Pago` | `monto`, `metodo`, `estado`, `referencia`, `fecha_pago`, `solicitud_id` | Una fila por solicitud (`solicitud_id` unique) |
| `Calificacion` | `puntuacion`, `comentario`, ids de cliente/prestador/servicio/solicitud | Una reseña por solicitud (`solicitud_id` unique) |

Estados de pago:

| Estado | Uso |
| --- | --- |
| `pending` | Intento creado, aún sin confirmación |
| `paid` | Pago confirmado y computable para estadísticas |
| `failed` | Pago fallido |
| `refunded` | Reembolsado |

### MongoDB: colecciones documentales

#### `ChatMessage`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `_id` | `ObjectId` | Identificador MongoDB |
| `roomId` | `String` | Sala, recomendada `request-{id}` |
| `senderId` | `Number` | Usuario emisor SQL |
| `receiverId` | `Number?` | Usuario receptor SQL |
| `message` | `String` | Contenido |
| `read` | `Boolean` | Lectura |
| `createdAt`, `updatedAt` | `Date` | Timestamps Mongoose |

#### `Notification`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `userId` | `Number` | Destinatario SQL |
| `title` | `String` | Encabezado |
| `message` | `String` | Mensaje de evento |
| `read` | `Boolean` | Estado leído |
| `createdAt`, `updatedAt` | `Date` | Timestamps |

#### `Log`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `userId` | `Number?` | Usuario relacionado |
| `action` | `String` | Acción registrada |
| `entity`, `entityId` | `String?` | Recurso asociado |
| `metadata` | `Object?` | Contexto flexible |

## 10. Modelo relacional

```mermaid
erDiagram
  ROLE ||--o{ USUARIO : asigna
  USUARIO ||--o{ SERVICIO : publica
  CATEGORIA ||--o{ SERVICIO : clasifica
  USUARIO ||--o{ SOLICITUD : solicita
  SERVICIO ||--o{ SOLICITUD : origina
  USUARIO ||--o{ DIRECCION : guarda
  DIRECCION ||--o{ SOLICITUD : utiliza
  USUARIO ||--o{ FAVORITO : registra_cliente
  USUARIO ||--o{ FAVORITO : guardado_prestador
  SOLICITUD ||--o| PAGO : paga
  SOLICITUD ||--o| CALIFICACION : recibe
  USUARIO ||--o{ CALIFICACION : escribe
  USUARIO ||--o{ CALIFICACION : recibe
  SERVICIO ||--o{ CALIFICACION : evalua

  ROLE {
    int id PK
    string nombre UK
  }
  USUARIO {
    int id PK
    string correo UK
    string password_hash
    int rol_id FK
    boolean disponible
  }
  CATEGORIA {
    int id PK
    string nombre UK
  }
  SERVICIO {
    int id PK
    string titulo
    float precio_base
    int prestador_id FK
    int categoria_id FK
  }
  SOLICITUD {
    int id PK
    string estado
    datetime fecha_programada
    datetime fecha_propuesta
    int cliente_id FK
    int servicio_id FK
  }
  DIRECCION {
    int id PK
    string calle
    int usuario_id FK
  }
  FAVORITO {
    int id PK
    int cliente_id FK
    int prestador_id FK
  }
  PAGO {
    int id PK
    float monto
    string estado
    int solicitud_id UK
  }
  CALIFICACION {
    int id PK
    int puntuacion
    int solicitud_id UK
  }
```

## 11. API REST y WebSocket

### Convenciones generales

| Concepto | Valor |
| --- | --- |
| Base URL local | `http://localhost:3000/api` |
| Socket.IO local | `http://localhost:3000/chat` |
| Formato | `application/json` |
| Autenticación protegida | `Authorization: Bearer ACCESS_TOKEN` |
| DTO validation | Campos extra rechazados por `forbidNonWhitelisted: true` |
| Rutas públicas | Auth, catálogo, categorías y reseñas públicas |

Respuesta de error típica:

```json
{
  "message": "Mensaje legible para la UI",
  "error": "Bad Request",
  "statusCode": 400
}
```

| HTTP | Motivo habitual |
| ---: | --- |
| `200` | Lectura o actualización correcta |
| `201` | Creación correcta |
| `400` | DTO inválido, fecha pasada o transición inválida |
| `401` | JWT ausente/inválido o credenciales incorrectas |
| `403` | Rol o propiedad insuficiente |
| `404` | Recurso no encontrado |
| `409` | Duplicidad o conflicto operativo |
| `500` | Fallo no controlado de infraestructura/aplicación |

### Autenticación

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `POST /auth/register` | Público | Registrar cliente o prestador | `{ nombre, apellido?, correo, password, telefono?, rol? }` | `{ message, user }` | `201`, `400`, `409` |
| `POST /auth/login` | Público | Obtener JWT | `{ correo, password }` | `{ access_token, user }` | `201`, `401` |

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "correo": "cliente@chambaapp.com",
  "password": "Password123"
}
```

```json
{
  "access_token": "JWT_AQUI",
  "user": {
    "id": 2,
    "nombre": "Cliente",
    "apellido": "Demo",
    "correo": "cliente@chambaapp.com",
    "rol": "cliente",
    "telefono": "5555555556"
  }
}
```

### Usuarios y perfiles

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /users/profile` | Autenticado | Perfil del JWT | Sin body | Perfil normalizado y estadísticas | `200`, `401` |
| `PATCH /users/profile` | Autenticado | Editar perfil propio | `{ nombre?, apellido?, correo?, telefono?, avatar?, ubicacion?, preferencias? }` | Perfil actualizado | `200`, `400`, `401`, `409` |
| `POST /users` | Admin | Crear usuario administrativamente | `{ nombre, correo, password, rol_id, ... }` | Usuario creado | `201`, `400`, `401`, `403` |
| `GET /users` | Admin | Listar usuarios | Sin body | `Usuario[]` | `200`, `401`, `403` |
| `GET /users/:id` | Admin | Obtener usuario | Sin body | Usuario | `200`, `401`, `403`, `404` |
| `PATCH /users/:id` | Admin o mismo usuario | Modificar usuario | Campos de usuario permitidos | Usuario actualizado | `200`, `400`, `401`, `403`, `404` |
| `DELETE /users/:id` | Admin | Eliminar usuario | Sin body | `{ message }` | `200`, `401`, `403`, `404` |
| `PATCH /providers/profile` | Prestador | Editar datos laborales | `{ especialidad?, descripcion?, experienciaAnios?, precioHora?, zonaCobertura?, disponible?, etiquetas? }` | Perfil normalizado | `200`, `400`, `401`, `403` |
| `PATCH /provider/availability` | Prestador | Cambiar disponibilidad | `{ disponible: boolean }` | Perfil normalizado | `200`, `400`, `401`, `403` |

### Catálogo y categorías

| Endpoint | Rol | Descripción | Request / Query | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /categories` | Público | Categorías con disponibilidad | Sin body | `{ data: [{ id, nombre, providersAvailable }] }` | `200` |
| `GET /services` | Público | Catálogo filtrable y paginado | Query: `search`, `categoryId`, `lat`, `lng`, `radiusKm`, `minPrice`, `maxPrice`, `minRating`, `available`, `verified`, `sort`, `page`, `limit` | `{ data, meta }` | `200`, `400` |
| `GET /services/:id` | Público | Detalle de servicio | Sin body | Servicio, prestador y reseñas calculadas | `200`, `404` |
| `POST /services` | Admin/prestador | Publicar servicio | `{ titulo, descripcion, precio_base, categoryId? }` | Servicio creado | `201`, `400`, `401`, `403` |
| `PATCH /services/:id` | Admin/dueño | Modificar servicio | `{ titulo?, descripcion?, precio_base?, disponible?, categoryId? }` | Servicio actualizado | `200`, `400`, `401`, `403`, `404` |
| `DELETE /services/:id` | Admin/dueño | Eliminar servicio | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

Ejemplo de catálogo:

```http
GET /api/services?available=true&sort=rating&page=1&limit=20
```

```json
{
  "data": [
    {
      "id": 1,
      "providerId": 3,
      "nombre": "Prestador Demo",
      "oficio": "Plomeria",
      "precio": 350,
      "disponibilidad": "Disponible",
      "rating": 4.5,
      "reviews": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### Direcciones

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /addresses` | Autenticado | Listar direcciones propias | Sin body | `{ data: Direccion[] }` | `200`, `401` |
| `POST /addresses` | Autenticado | Crear dirección propia | `{ etiqueta?, calle, ciudad, estado, codigoPostal?, lat?, lng? }` | Dirección creada | `201`, `400`, `401` |
| `PATCH /addresses/:id` | Propietario | Actualizar dirección | Mismo DTO de creación | Dirección actualizada | `200`, `400`, `401`, `404` |

### Solicitudes y agenda orientadas a UI

Modelo de solicitud normalizada:

```json
{
  "id": 24,
  "title": "Reparacion de fuga",
  "description": "Fuga debajo del lavabo",
  "priority": "urgent",
  "status": "pending",
  "scheduledAt": "2026-05-27T16:00:00.000Z",
  "proposedAt": null,
  "hasPendingDateProposal": false,
  "estimatedDurationMin": 90,
  "estimatedPrice": 350,
  "payment": null,
  "address": "Calle Uno 10",
  "client": { "id": 2, "nombre": "Cliente Demo" },
  "provider": { "id": 3, "nombre": "Prestador Demo" },
  "service": { "id": 1, "title": "Plomeria general" }
}
```

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `POST /requests` | Cliente | Crear solicitud agendada | `{ serviceId?, providerId?, categoryId?, titulo, descripcion, prioridad?, fechaSolicitada, duracionEstimadaMin, direccion?, direccionId?, precioEstimado? }` | Solicitud normalizada | `201`, `400`, `401`, `403`, `404` |
| `GET /requests/mine` | Cliente | Historial propio | Sin body | `{ data: Request[] }` | `200`, `401`, `403` |
| `GET /requests/:id` | Participante | Consultar solicitud | Sin body | Solicitud normalizada | `200`, `401`, `403`, `404` |
| `PATCH /requests/:id/cancel` | Cliente dueño | Cancelar pendiente/aceptada | Sin body | Solicitud cancelada | `200`, `401`, `403`, `404`, `409` |
| `PATCH /requests/:id/reschedule` | Cliente dueño | Cambiar fecha pendiente | `{ fechaSolicitada, duracionEstimadaMin? }` | Solicitud actualizada | `200`, `400`, `401`, `404`, `409` |
| `PATCH /requests/:id/accept-date` | Cliente dueño | Aceptar propuesta de fecha | Sin body | Solicitud actualizada | `200`, `401`, `404`, `409` |

```http
POST /api/requests
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "serviceId": 1,
  "titulo": "Reparacion de fuga",
  "descripcion": "Fuga debajo del lavabo",
  "prioridad": "urgent",
  "fechaSolicitada": "2026-05-27T16:00:00.000Z",
  "duracionEstimadaMin": 90,
  "direccion": "Calle Uno 10",
  "precioEstimado": 350
}
```

### Operación del prestador

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /provider/requests` | Prestador | Bandeja de solicitudes | Sin body | `{ data: Request[] }` | `200`, `401`, `403` |
| `PATCH /provider/requests/:id/accept` | Prestador dueño | Confirmar solicitud si agenda permite | Sin body | Solicitud `accepted` | `200`, `401`, `403`, `404`, `409` |
| `PATCH /provider/requests/:id/reject` | Prestador dueño | Rechazar solicitud | `{ motivo?: string }` | Solicitud `rejected` | `200`, `401`, `403`, `404`, `409` |
| `PATCH /provider/requests/:id/propose-date` | Prestador dueño | Proponer nueva visita | `{ fechaPropuesta }` | Solicitud con propuesta pendiente | `200`, `400`, `401`, `403`, `404`, `409` |
| `GET /provider/jobs` | Prestador | Trabajos aceptados/históricos | Sin body | `{ data: Request[] }` | `200`, `401`, `403` |
| `PATCH /provider/jobs/:id/status` | Prestador dueño | Avanzar ejecución | `{ status: "on_the_way" \| "in_progress" \| "completed" }` | Solicitud actualizada | `200`, `400`, `401`, `403`, `404`, `409` |
| `GET /provider/calendar` | Prestador | Agenda de trabajos | Sin body | `{ data: Request[] }` ordenado por fecha | `200`, `401`, `403` |

Respuesta especial por cruce de agenda:

```json
{
  "message": "Ya tienes un servicio agendado en ese horario",
  "code": "SCHEDULE_CONFLICT"
}
```

### Solicitudes legacy CRUD

Estas rutas se mantienen por compatibilidad; la UI moderna utiliza `/requests`.

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `POST /solicitudes` | Admin/cliente | Crear solicitud legacy | `{ descripcion?, direccion_servicio?, servicio_id }` | Solicitud | `201`, `400`, `401`, `403`, `404` |
| `GET /solicitudes` | Autenticado | Listar según acceso | Sin body | Solicitudes visibles | `200`, `401` |
| `GET /solicitudes/:id` | Participante/admin | Obtener | Sin body | Solicitud | `200`, `401`, `403`, `404` |
| `PATCH /solicitudes/:id` | Participante/admin | Actualizar | `{ descripcion?, direccion_servicio?, estado? }` | Solicitud | `200`, `400`, `401`, `403`, `404` |
| `DELETE /solicitudes/:id` | Cliente dueño/admin | Eliminar | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

### Pagos

La UI moderna utiliza el flujo por solicitud. No se procesan tarjetas; `method` y `reference` modelan una confirmación académica.

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /requests/:id/payment` | Participante | Leer pago de solicitud | Sin body | Pago normalizado | `200`, `401`, `403`, `404` |
| `POST /requests/:id/payment` | Cliente dueño | Crear intento de pago | `{ method, reference? }` | Pago `pending` | `201`, `400`, `401`, `403`, `404`, `409` |
| `PATCH /requests/:id/payment/confirm` | Cliente dueño | Confirmar pago | Sin body | Pago `paid` | `200`, `400`, `401`, `403`, `404`, `409` |
| `POST /pagos` | Cliente dueño | Crear pago legacy compatible | `{ monto, metodo?, referencia?, solicitud_id }`; `monto` es ignorado | Pago normalizado | `201`, `400`, `401`, `403`, `409` |
| `GET /pagos` | Autenticado | Listar pagos accesibles | Sin body | Pagos con relaciones | `200`, `401` |
| `GET /pagos/:id` | Participante/admin | Obtener pago | Sin body | Pago | `200`, `401`, `403`, `404` |
| `PATCH /pagos/:id` | Cliente dueño/admin | Editar; cliente no cambia monto/estado | `{ metodo?, referencia?, monto?, estado?, fecha_pago? }` | Pago | `200`, `400`, `401`, `403`, `404` |
| `DELETE /pagos/:id` | Cliente dueño/admin | Eliminar | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

```http
POST /api/requests/24/payment
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "method": "transferencia",
  "reference": "OP-123"
}
```

```json
{
  "id": 10,
  "requestId": 24,
  "amount": 350,
  "method": "transferencia",
  "reference": "OP-123",
  "status": "pending",
  "paidAt": null
}
```

### Calificaciones y reputación

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `POST /requests/:id/review` | Cliente dueño | Calificar trabajo completado | `{ rating: 1..5, comment?: string }` | Calificación creada | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /providers/:id/reviews` | Público | Reseñas públicas de prestador | Sin body | `{ summary, data }` | `200` |
| `GET /provider/reviews/summary` | Prestador | Reputación propia | Sin body | `{ summary, data }` | `200`, `401`, `403` |
| `POST /calificaciones` | Admin/cliente | Crear calificación legacy | `{ puntuacion, comentario?, solicitud_id }` | Calificación creada | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /calificaciones` | Autenticado | Listar calificaciones accesibles | Sin body | `Calificacion[]` | `200`, `401` |
| `GET /calificaciones/:id` | Participante/admin | Consultar | Sin body | Calificación | `200`, `401`, `403`, `404` |
| `PATCH /calificaciones/:id` | Cliente autor/admin | Editar | `{ puntuacion?, comentario? }` | Calificación | `200`, `400`, `401`, `403`, `404` |
| `DELETE /calificaciones/:id` | Cliente autor/admin | Eliminar | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

Regla esencial: `Solicitud.calificacion` es uno-a-uno y `Calificacion.solicitud_id` es `unique`. El servicio rechaza un segundo intento con `409`; el frontend oculta la acción y muestra `Ya calificado`.

### Favoritos

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /favorites` | Cliente | Prestadores guardados | Sin body | `{ data: ServiceCard[] }` | `200`, `401`, `403` |
| `POST /favorites/:providerId` | Cliente | Guardar prestador | Sin body | `{ providerId, favorito: true }` | `201`, `401`, `403`, `404`, `409` |
| `DELETE /favorites/:providerId` | Cliente | Eliminar favorito | Sin body | `{ providerId, favorito: false }` | `200`, `401`, `403` |

### Dashboard y ganancias

| Endpoint | Rol | Descripción | Request / Query | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /dashboard/client` | Cliente | Indicadores del cliente | Sin body | `{ activeRequests, completedServices, monthSpent, favorites, upcoming }` | `200`, `401`, `403` |
| `GET /dashboard/provider` | Prestador | Indicadores profesionales | Sin body | `{ pendingRequests, activeJobs, completedJobs, rating, reviews, earnings }` | `200`, `401`, `403` |
| `GET /provider/earnings/summary` | Prestador | Ganancias pagadas | Query opcional `from`, `to` | `{ weekly, monthTotal, weekTotal, availableBalance, monthlyGrowthPercent }` | `200`, `401`, `403` |
| `GET /provider/transactions` | Prestador | Transacciones pagadas | Sin body | `{ data: Pago[] }` | `200`, `401`, `403` |

### Conversaciones y chats

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /conversations` | Autenticado | Salas derivadas de solicitudes accesibles | Sin body | `{ data: [{ id, requestId, otherUser, lastMessage, unreadCount }] }` | `200`, `401` |
| `GET /conversations/:id/messages` | Participante/admin | Historial normalizado | Sin body | `{ data: Message[] }` | `200`, `401`, `403`, `404` |
| `POST /conversations/:id/messages` | Participante/admin | Enviar texto | `{ text }` | Mensaje normalizado | `201`, `400`, `401`, `403`, `404` |
| `PATCH /conversations/:id/read` | Participante/admin | Marcar mensajes recibidos leídos | Sin body | `{ id, unreadCount: 0 }` | `200`, `401`, `403`, `404` |
| `POST /chats` | Autenticado | Crear mensaje legacy | `{ roomId, receiverId?, message }` | Documento MongoDB | `201`, `400`, `401` |
| `GET /chats` | Autenticado | Mensajes accesibles | Sin body | `ChatMessage[]` | `200`, `401` |
| `GET /chats/room/:roomId` | Autenticado | Mensajes de sala accesible | Sin body | `ChatMessage[]` | `200`, `401` |
| `GET /chats/:id` | Participante/admin | Mensaje por id | Sin body | `ChatMessage` | `200`, `401`, `403`, `404` |
| `PATCH /chats/:id` | Emisor/admin | Editar mensaje o lectura | `{ message?, read? }` | Documento actualizado | `200`, `400`, `401`, `403`, `404` |
| `DELETE /chats/:id` | Emisor/admin | Borrar mensaje | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

### Notificaciones y logs

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /notifications` | Autenticado | Notificaciones propias; admin ve todas | Sin body | `Notification[]` | `200`, `401` |
| `GET /notifications/:id` | Dueño/admin | Obtener aviso | Sin body | `Notification` | `200`, `401`, `403`, `404` |
| `POST /notifications` | Admin | Crear aviso manual | `{ userId, title, message }` | Notificación | `201`, `400`, `401`, `403` |
| `PATCH /notifications/:id` | Dueño/admin | Actualizar o marcar leído | `{ title?, message?, read? }` | Notificación | `200`, `400`, `401`, `403`, `404` |
| `DELETE /notifications/:id` | Dueño/admin | Eliminar aviso | Sin body | `{ message }` | `200`, `401`, `403`, `404` |
| `POST /logs` | Admin | Registrar auditoría | `{ userId?, action, entity?, entityId?, metadata? }` | Log | `201`, `400`, `401`, `403` |
| `GET /logs` | Admin | Consultar auditoría | Sin body | `Log[]` | `200`, `401`, `403` |
| `GET /logs/:id` | Admin | Ver log | Sin body | `Log` | `200`, `401`, `403`, `404` |
| `DELETE /logs/:id` | Admin | Eliminar log | Sin body | `{ message }` | `200`, `401`, `403`, `404` |

### Salud básica

| Endpoint | Rol | Descripción | Request | Response | Códigos |
| --- | --- | --- | --- | --- | --- |
| `GET /` | Público | Ruta base de aplicación backend | Sin body | Texto del `AppService` | `200` |

### WebSocket `/chat`

El backend ofrece Socket.IO aunque el frontend actual trabaja principalmente por polling REST.

Conexión autenticada:

```js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/chat', {
  auth: { token: accessToken },
})
```

| Evento cliente | Payload | Respuesta / evento |
| --- | --- | --- |
| `joinRoom` | `{ roomId: "request-24" }` | ACK `{ event: "joinedRoom", data }` tras validar participación |
| `sendMessage` | `{ roomId: "request-24", message: "Hola" }` | Emite `newMessage` a la sala |

Eventos operativos emitidos a sala privada `user-{id}`:

| Evento | Causa |
| --- | --- |
| `requestCreated` | Cliente crea solicitud |
| `requestStatusChanged` | Cancelación, aceptación, rechazo o avance |
| `requestRescheduled` | Cliente reprograma |
| `dateProposed` | Prestador propone fecha |
| `dateAccepted` | Cliente acepta propuesta |
| `paymentPaid` | Cliente confirma pago |

## 12. Variables de entorno

### Frontend

| Variable | Requerida | Default | Descripción |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `http://localhost:3000/api` | Base REST utilizada por `src/services/api.js` |

Archivo local sugerido `ChambaApp-FrontEnd/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend

| Variable | Requerida | Ejemplo local | Descripción |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sí | `postgresql://chamba:chamba123@localhost:5432/chambaapp_db?schema=public` | Conexión Prisma a PostgreSQL |
| `JWT_SECRET` | Sí en producción | `cambia_este_secreto` | Firma/verificación de JWT |
| `MONGODB_URI` | Sí para documentos | `mongodb://127.0.0.1:27017/chambaapp` | URI prioritaria para MongoDB |
| `MONGO_URI` | Alternativa | `mongodb://127.0.0.1:27017/chambaapp` | Fallback a `MONGODB_URI` |
| `PORT` | No | `3000` | Puerto HTTP/Socket backend |

Archivo backend `.env` de desarrollo:

```env
DATABASE_URL="postgresql://chamba:chamba123@localhost:5432/chambaapp_db?schema=public"
JWT_SECRET="reemplazar-por-un-secreto-largo-y-aleatorio"
MONGODB_URI="mongodb://127.0.0.1:27017/chambaapp"
PORT=3000
```

Nunca versionar valores reales de `JWT_SECRET` ni credenciales de base de datos.

## 13. Instalación local

### Requisitos

| Requisito | Uso |
| --- | --- |
| Node.js 20+ o 22 LTS | Frontend y backend |
| npm | Instalación y scripts |
| PostgreSQL 16 | Persistencia relacional, o Docker Compose backend |
| MongoDB local o URI accesible | Chat, notificaciones y logs |
| Docker / Docker Compose | Opcional para backend y PostgreSQL |

### Estructura recomendada de checkout

```text
3erParcial/
├── ChambaApp-FrontEnd/
└── chabaapp-backend/
```

### Clonar repositorios

Los remotos no están declarados en los archivos analizados; sustituya las URLs por las del equipo:

```bash
git clone <URL_FRONTEND> ChambaApp-FrontEnd
git clone <URL_BACKEND> chabaapp-backend
```

### Levantar backend sin Docker

```bash
cd chabaapp-backend
npm install
cp .env.example .env
```

Configure PostgreSQL y MongoDB en `.env`, después:

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run start:dev
```

Backend disponible en:

```text
http://localhost:3000/api
```

### Cuentas seed

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Admin | `admin@chambaapp.com` | `Password123` |
| Cliente | `cliente@chambaapp.com` | `Password123` |
| Prestador | `prestador@chambaapp.com` | `Password123` |

Estas credenciales son exclusivamente de desarrollo; no deben existir en producción.

### Levantar frontend

```bash
cd ChambaApp-FrontEnd
npm install
printf 'VITE_API_URL=http://localhost:3000/api\n' > .env.local
npm run dev
```

Abrir la URL reportada por Vite, normalmente:

```text
http://localhost:5173
```

### Scripts frontend

| Comando | Función |
| --- | --- |
| `npm run dev` | Servidor Vite con recarga en caliente |
| `npm run build` | Genera salida estática optimizada en `dist/` |
| `npm run preview` | Sirve localmente el build ya generado |
| `npm run lint` | Ejecuta ESLint |

### Scripts backend

| Comando | Función |
| --- | --- |
| `npm run start:dev` | NestJS en modo watch |
| `npm run build` | Transpila backend |
| `npm run start:prod` | Ejecuta salida compilada |
| `npm run seed` | Carga roles, usuarios y servicio demo |
| `npm run test` | Pruebas Jest |
| `npm run test:e2e` | Suite end-to-end configurada |
| `npm run test:cov` | Cobertura |

## 14. Docker y despliegue

### Estado actual

| Pieza | Existe | Ubicación |
| --- | --- | --- |
| Dockerfile frontend | No | Pendiente |
| Docker Compose frontend | No | Pendiente |
| Dockerfile backend | Sí | `chabaapp-backend/Dockerfile` |
| Docker Compose backend + PostgreSQL | Sí | `chabaapp-backend/docker-compose.yml` |
| Contenedor MongoDB en Compose | No | Debe usarse URI externa o agregarse un servicio Mongo |

### Backend con Docker Compose

El Compose existente crea:

| Servicio | Imagen/build | Puerto | Volumen |
| --- | --- | --- | --- |
| `postgres` | `postgres:16` | `5432:5432` | `postgres_data` |
| `backend` | Build del `Dockerfile` | `3000:3000` | Sin volumen |

El contenedor backend ejecuta al iniciar:

```bash
npx prisma migrate deploy && npx prisma db seed && node dist/src/main.js
```

Uso:

```bash
cd chabaapp-backend
cp .env.example .env
# Ajustar DATABASE_URL al hostname postgres dentro de Compose:
# postgresql://chamba:chamba123@postgres:5432/chambaapp_db?schema=public
docker compose up --build
```

Apagado conservando datos:

```bash
docker compose down
```

Apagado eliminando el volumen de PostgreSQL:

```bash
docker compose down -v
```

### Despliegue frontend estático

El frontend genera archivos estáticos:

```bash
npm ci
VITE_API_URL=https://api.example.com/api npm run build
```

El directorio `dist/` puede desplegarse en Nginx, CDN, Vercel, Netlify, S3/CloudFront u otro hosting SPA. El hosting debe redirigir rutas no encontradas a `index.html` para que React Router resuelva navegación cliente.

Configuración Nginx recomendada, no incluida actualmente en el repositorio:

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Consideraciones de producción

- Definir `VITE_API_URL` antes del build frontend; Vite lo incrusta al compilar.
- Restringir CORS backend al dominio frontend; el código actual llama `enableCors()` sin lista de orígenes.
- Ejecutar migraciones antes o durante el despliegue backend con control de fallos.
- Usar secretos administrados por plataforma, no `.env` dentro de imagen.
- Proveer MongoDB altamente disponible o incorporarlo al stack gestionado.

## 15. Pipeline CI/CD

### Estado actual

No se encontraron workflows de GitHub Actions, GitLab CI, Jenkins ni Azure Pipelines en los repositorios inspeccionados. La siguiente definición es una recomendación operativa, no una capacidad ya instalada.

### Pipeline recomendado

```mermaid
flowchart LR
  PR["Pull Request"] --> Install["npm ci"]
  Install --> Lint["Lint frontend/backend"]
  Lint --> Tests["Jest backend"]
  Tests --> Builds["Build frontend + backend"]
  Builds --> Images["Imagen backend / artefacto frontend"]
  Images --> Stage["Despliegue staging"]
  Stage --> Smoke["Smoke tests API/UI"]
  Smoke --> Approve{"Aprobación producción"}
  Approve --> Prod["Despliegue producción"]
```

### Validaciones mínimas por cambio

| Área | Comandos recomendados |
| --- | --- |
| Frontend | `npm ci && npm run lint && npm run build` |
| Backend | `npm ci && npx prisma generate && npm run test && npm run build` |
| Migraciones | Validar `npx prisma migrate deploy` en base staging |
| Seguridad | Escaneo de secretos y dependencias |
| Despliegue | Healthcheck de `/api`, login seed de staging y carga del frontend |

### Estrategia de ambientes

| Ambiente | Uso | Datos |
| --- | --- | --- |
| Local | Desarrollo individual | Seeds y DB local |
| Staging | Validación integrada | Seeds controladas, secretos separados |
| Producción | Usuarios reales | Migraciones controladas, sin cuentas demo |

## 16. Seguridad

### Controles implementados

| Control | Implementación |
| --- | --- |
| Hash de credenciales | `bcrypt.hash(password, 10)` |
| Tokens | JWT firmado por backend |
| Autorización de rutas | `AuthGuard('jwt')` y `RolesGuard` |
| Autorización por recurso | Servicios comprueban dueño/participante |
| Validación de entrada | `ValidationPipe` con whitelist, rechazo de campos no permitidos y transformación |
| Agenda | Validación de fecha futura y cruce horario bajo transacción |
| Pago | Backend deriva monto persistido y exige solicitud elegible |
| Reseña | Sólo solicitud completada; una calificación por solicitud |
| WebSocket | Token JWT al conectar y validación al entrar a sala |
| Privacidad | Datos de contacto/dirección del cliente ocultos al prestador antes de aceptar |

### Riesgos y endurecimiento pendiente

| Riesgo | Estado actual | Recomendación |
| --- | --- | --- |
| JWT en `localStorage` | Implementado en frontend | Migrar a cookie `HttpOnly`, `Secure`, `SameSite` y protección CSRF cuando el modelo de despliegue lo permita |
| CORS abierto | `app.enableCors()` sin restricción | Configurar allowlist por ambiente |
| Rate limiting | No observado | Proteger login, mensajes y endpoints mutables |
| Procesamiento de pagos | Simulado | Integrar PSP tokenizado; nunca capturar tarjeta/CVV en API propia |
| Logs sensibles | Metadata flexible | Enmascarar PII y establecer retención |
| Secretos | `.env` requerido | Usar Secret Manager/Vault en producción |

### Matriz resumida de permisos

| Recurso | Cliente | Prestador | Admin |
| --- | --- | --- | --- |
| Catálogo público | Leer | Leer/publicar propia | Administrar |
| Solicitud nueva | Crear propia | No | Legacy permitido |
| Respuesta solicitud | Cancelar/reprogramar/aceptar fecha | Aceptar/rechazar/proponer fecha | Operación legacy |
| Pago | Crear/confirmar propio | Consultar relacionado | Administrar legacy |
| Reseña | Crear una propia y editar propia | Consultar recibidas | Administrar |
| Chat | Conversaciones participantes | Conversaciones participantes | Acceso amplio |
| Notificaciones | Propias | Propias | Crear y administrar |
| Logs | Sin acceso | Sin acceso | Administrar |

## 17. Manejo de errores y observabilidad

### Backend

- NestJS propaga excepciones HTTP específicas: `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException` y `ConflictException`.
- Los DTOs fallan antes de llegar al servicio si el cuerpo viola tipos o contiene campos no permitidos.
- `SCHEDULE_CONFLICT` añade un código estable para presentar colisión de agenda en UI.
- `LogsModule` provee persistencia documental administrativa, aunque el análisis no encontró instrumentación automática global de cada request.

### Frontend

- `apiRequest()` lee JSON y normaliza `data.message` en un `Error`.
- Pantallas conservan un mensaje visible en estado local para fallos de formularios y acciones.
- Polling de indicadores ignora fallos de fondo para no interrumpir la pantalla activa.

### Recomendaciones de observabilidad

| Necesidad | Recomendación |
| --- | --- |
| Correlación | Agregar request ID y retornarlo en headers/respuestas de error |
| Logs backend | Logger estructurado JSON sin credenciales ni tokens |
| Métricas | Latencia, tasa de errores, pagos confirmados, solicitudes aceptadas |
| Alertas | Caída de PostgreSQL/MongoDB, errores 5xx, fallo de migración |
| Frontend | Integrar seguimiento de errores y source maps protegidos |

## 18. Estrategia de testing

### Cobertura presente

| Área backend | Pruebas observadas |
| --- | --- |
| Agenda | Crear con fecha futura, rechazar fecha pasada, conflicto, aceptación sin traslape, reprogramación ajena |
| Pago | Bloquear antes de aceptación, ignorar monto manipulable, confirmar y notificar, denegar acceso ajeno |
| Dashboard | Totales basados en pagos `paid` |
| Socket.IO | Autenticar socket, desconectar JWT inválido, autorizar sala |
| Base y módulos | Specs de controllers/services y `PrismaService` |
| E2E | Archivo base `test/app.e2e-spec.ts` |

### Estado frontend

No se encontraron suites automatizadas del frontend. Actualmente su validación automatizada disponible es lint y build:

```bash
cd ChambaApp-FrontEnd
npm run lint
npm run build
```

### Ejecutar pruebas backend

```bash
cd chabaapp-backend
npm run test
npm run test:e2e
npm run test:cov
```

### Estrategia recomendada

| Nivel | Frontend | Backend |
| --- | --- | --- |
| Unitario | Formatters, estados de botones, modales | Servicios y guards |
| Integración | Pantallas con API mockeada | Controllers + Prisma test DB |
| E2E | Login, agenda, pago, reseña, chat | API contra PostgreSQL/MongoDB efímeros |
| Regresión | Responsive desktop/móvil | Migraciones y permisos por rol |

Casos críticos a preservar:

1. Cliente no puede pagar una solicitud pendiente.
2. Prestador no puede aceptar horarios traslapados.
3. Cliente no puede calificar dos veces una misma solicitud.
4. Usuario no participante no puede leer chat o pago.
5. Ganancias sólo incluyen pagos confirmados.

## 19. Escalabilidad

### Estado actual

El backend monolítico modular es apropiado para la fase actual: reduce complejidad operativa y mantiene las reglas transaccionales de solicitud/agenda/pago cercanas a PostgreSQL.

### Escalamiento incremental

| Escala | Acción |
| --- | --- |
| Primer incremento | Servir frontend por CDN y desplegar varias réplicas stateless del backend |
| Persistencia | PostgreSQL administrado con backups, índices y réplicas de lectura donde aplique |
| Tiempo real | Adaptador Redis para Socket.IO al correr múltiples instancias |
| Rendimiento de catálogo | Cache de categorías/catálogo y búsqueda geoespacial indexada |
| Procesamiento diferido | Cola para notificaciones, correos y eventos de pago |
| Observabilidad | Métricas centralizadas, trazas y alertas |

### Candidatos a extracción futura

| Dominio | Cuándo extraer |
| --- | --- |
| Notificaciones | Si incorpora push/email/SMS y alta carga asíncrona |
| Mensajería | Si el volumen o tiempo real exige escalamiento independiente |
| Pagos | Si se integra PSP real, webhooks y conciliación |
| Búsqueda | Si se adopta motor especializado por ubicación/ranking |

No se recomienda fragmentar a microservicios antes de tener necesidades de escala, propiedad de equipos o aislamiento de riesgo que justifiquen el costo distribuido.

## 20. Decisiones arquitectónicas

### ADR-001: SPA React separada de API NestJS

| Aspecto | Decisión |
| --- | --- |
| Contexto | Se necesitan paneles ricos por rol y una API reutilizable |
| Decisión | Frontend React/Vite separado de backend NestJS |
| Ventajas | Desarrollo UI independiente, build estático, API consumible por futuros clientes |
| Desventajas | Manejo CORS, despliegues coordinados y contrato API explícito |

### ADR-002: Backend monolítico modular

| Aspecto | Decisión |
| --- | --- |
| Contexto | Dominio todavía cohesivo y transaccional |
| Decisión | Un proceso NestJS con módulos por dominio |
| Ventajas | Menor complejidad de operación, reglas consistentes, transacciones simples |
| Desventajas | Escala conjunta y posible acoplamiento si crece sin fronteras |

### ADR-003: Persistencia híbrida PostgreSQL + MongoDB

| Aspecto | Decisión |
| --- | --- |
| Contexto | Solicitudes/pagos requieren integridad; chat y logs son documentos/eventos |
| Decisión | Prisma/PostgreSQL para negocio y Mongoose/MongoDB para interacción |
| Ventajas | Relaciones sólidas en core y flexibilidad documental |
| Desventajas | Dos motores que respaldar, monitorizar y mantener consistentes |

### ADR-004: Agenda protegida al aceptar

| Aspecto | Decisión |
| --- | --- |
| Contexto | Dos clientes podrían reservar simultáneamente el mismo prestador |
| Decisión | Verificar colisiones dentro de transacción con bloqueo por prestador |
| Ventajas | Evita doble reserva al momento de compromiso |
| Desventajas | Mayor contención en prestadores con alta demanda |

### ADR-005: Pago simulado con monto calculado por backend

| Aspecto | Decisión |
| --- | --- |
| Contexto | La versión académica necesita flujo de pago, no procesamiento financiero real |
| Decisión | Pago `pending`/`paid` sin tarjeta y monto derivado de solicitud |
| Ventajas | Flujo demostrable y evita manipulación del cliente |
| Desventajas | No representa liquidación bancaria ni cumplimiento PSP |

### ADR-006: Polling en frontend para mensajes/notificaciones

| Aspecto | Decisión |
| --- | --- |
| Contexto | Backend tiene REST y Socket.IO; UI requería actualización confiable inmediata |
| Decisión actual | Polling REST periódico en layouts y conversaciones |
| Ventajas | Implementación simple y fuente de verdad HTTP |
| Desventajas | Peticiones recurrentes y latencia de segundos; Socket.IO puede reemplazarlo |

## 21. Roadmap

### Contrato y experiencia

- [ ] Implementar `GET /api/provider/services` para administrar publicaciones propias sin filtrar catálogo público.
- [ ] Normalizar detalle de servicio con título/disponibilidad originales para edición confiable.
- [ ] Migrar mensajes/notificaciones de polling a eventos Socket.IO con reconciliación REST.
- [ ] Añadir detalle público del prestador y vista de servicio expandida.
- [ ] Añadir bloques avanzados de disponibilidad y reprogramación calendarizada.
- [ ] Añadir retiros y reportes descargables para prestador.

### Seguridad y plataforma

- [ ] Sustituir token en `localStorage` por estrategia de sesión endurecida.
- [ ] Configurar CORS por ambiente y rate limiting.
- [ ] Añadir rotación de secretos y monitoreo.
- [ ] Integrar proveedor de pago real con tokenización y webhooks.
- [ ] Agregar auditoría automática para acciones críticas.

### Entrega y calidad

- [ ] Agregar Dockerfile y configuración de hosting del frontend.
- [ ] Crear pipeline CI/CD versionado.
- [ ] Incorporar pruebas unitarias/componentes y E2E del frontend.
- [ ] Ejecutar pruebas de accesibilidad y regresión visual responsive.

## 22. Contribución

### Flujo de trabajo

1. Cree una rama desde la rama de integración acordada:

```bash
git switch -c feature/descripcion-breve
```

2. Instale dependencias y levante frontend/backend según [Instalación local](#13-instalación-local).
3. Mantenga cambios enfocados en una capacidad o corrección.
4. Ejecute validaciones antes de abrir Pull Request:

```bash
cd ChambaApp-FrontEnd
npm run lint
npm run build

cd ../chabaapp-backend
npm run test
npm run build
```

5. Abra un Pull Request que indique objetivo, rutas modificadas, impacto de API/migraciones y evidencia de prueba.

### Convenciones recomendadas

| Categoría | Convención |
| --- | --- |
| Componentes React | PascalCase: `RequestServiceModal.jsx` |
| Servicios API | Objetos por recurso en `src/services/api.js` |
| CSS | Archivo por pantalla/flujo importado en `App.css` |
| Endpoints | Mantener normalización orientada a UI y documentar compatibilidad legacy |
| Migraciones | Nunca reescribir migraciones aplicadas; crear una nueva |
| Commits | Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:` |

### Checklist de Pull Request

- [ ] El cambio respeta permisos por rol.
- [ ] No expone secretos, token, datos bancarios o PII innecesaria.
- [ ] Actualiza documentación si cambia API, variable o flujo.
- [ ] Incluye pruebas acordes al riesgo.
- [ ] Verifica experiencia desktop y móvil si toca UI.
- [ ] Contempla migración y rollback si modifica persistencia.

## 23. Licencia

El backend declara `"license": "UNLICENSED"` y este repositorio frontend no contiene un archivo `LICENSE` ni una licencia explícita observada. Por lo tanto, el código debe tratarse como **propietario y no licenciado para redistribución** hasta que el equipo publique una licencia formal.

Para liberar el proyecto públicamente, el equipo debe seleccionar y agregar una licencia compatible con sus objetivos legales y de distribución.
