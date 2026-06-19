// ***********************************************
// Custom Cypress Commands — ChambaApp
// ***********************************************

const clientUser = {
  id: 1,
  nombre: 'Cliente',
  apellido: 'Prueba',
  correo: 'cliente@test.com',
  telefono: '5550001111',
  rol: 'cliente',
};

const providerUser = {
  id: 2,
  nombre: 'Prestador',
  apellido: 'Prueba',
  correo: 'prestador@test.com',
  telefono: '5550002222',
  rol: 'prestador',
};

const categories = [
  { id: 1, nombre: 'Plomería', providersAvailable: 3 },
  { id: 2, nombre: 'Electricidad', providersAvailable: 2 },
];

const services = [
  {
    id: 101,
    providerId: 2,
    nombre: 'Plomería Express',
    oficio: 'Reparación de fugas',
    rating: 4.8,
    reviews: 18,
    distancia: '2.1 km',
    disponibilidad: 'Disponible hoy',
    precio: 250,
  },
  {
    id: 102,
    providerId: 3,
    nombre: 'Electricidad Segura',
    oficio: 'Instalación eléctrica',
    rating: 4.6,
    reviews: 11,
    distancia: '3.4 km',
    disponibilidad: 'Mañana',
    precio: 320,
  },
];

const requests = [
  {
    id: 201,
    title: 'Reparación de fuga',
    status: 'accepted',
    requestedAt: '2026-06-18T16:00:00.000Z',
    scheduledAt: '2026-06-20T16:00:00.000Z',
    estimatedPrice: 500,
    finalPrice: 500,
    payment: null,
    address: {
      calle: 'Av. Siempre Viva 123',
      colonia: 'Centro',
      ciudad: 'CDMX',
    },
    provider: { id: 2, nombre: 'Prestador Prueba' },
  },
  {
    id: 202,
    title: 'Instalación de lámpara',
    status: 'completed',
    requestedAt: '2026-06-10T12:00:00.000Z',
    scheduledAt: '2026-06-11T12:00:00.000Z',
    estimatedPrice: 350,
    finalPrice: 350,
    payment: { status: 'paid' },
    address: {
      calle: 'Calle Norte 45',
      colonia: 'Roma',
      ciudad: 'CDMX',
    },
    provider: { id: 2, nombre: 'Prestador Prueba' },
  },
];

const pendingPaymentRequest = {
  id: 203,
  title: 'Servicio listo para pago',
  status: 'completed',
  requestedAt: '2026-06-12T12:00:00.000Z',
  scheduledAt: '2026-06-13T12:00:00.000Z',
  estimatedPrice: 350,
  finalPrice: 350,
  payment: null,
  address: {
    calle: 'Calle Pago 100',
    colonia: 'Centro',
    ciudad: 'CDMX',
  },
  provider: { id: 2, nombre: 'Prestador Prueba' },
};

const providerRequests = [
  {
    id: 301,
    title: 'Cambio de contacto',
    status: 'pending',
    priority: 'normal',
    requestedAt: '2026-06-18T12:00:00.000Z',
    estimatedPrice: 420,
    address: {
      calle: 'Calle Cliente 10',
      colonia: 'Centro',
      ciudad: 'CDMX',
    },
    client: { id: 1, nombre: 'Cliente Prueba', telefono: '5550001111' },
  },
];

const providerJobs = [
  {
    id: 401,
    title: 'Limpieza profunda',
    status: 'accepted',
    requestedAt: '2026-06-18T14:00:00.000Z',
    scheduledAt: '2026-06-19T14:00:00.000Z',
    estimatedPrice: 700,
    finalPrice: null,
    address: {
      calle: 'Av. Trabajo 222',
      colonia: 'Industrial',
      ciudad: 'CDMX',
    },
    client: { id: 1, nombre: 'Cliente Prueba', telefono: '5550001111' },
  },
];

const conversations = [
  {
    id: 'conv-client-1',
    unreadCount: 1,
    lastMessage: 'Voy en camino',
    lastMessageAt: '2026-06-18T15:00:00.000Z',
    otherUser: { id: 2, nombre: 'Prestador Uno', oficio: 'Plomero' },
  },
  {
    id: 'conv-client-2',
    unreadCount: 0,
    lastMessage: 'Gracias por confirmar',
    lastMessageAt: '2026-06-18T14:00:00.000Z',
    otherUser: { id: 3, nombre: 'Prestador Dos', oficio: 'Electricista' },
  },
];

const messagesByConversation = {
  'conv-client-1': [
    { id: 'm1', senderId: 2, text: 'Hola, confirmo tu servicio.' },
    { id: 'm2', senderId: 1, text: 'Perfecto, gracias.' },
  ],
  'conv-client-2': [
    { id: 'm3', senderId: 3, text: 'Nos vemos mañana.' },
  ],
};

function setAuth(win, user) {
  win.localStorage.setItem('chamba_token', `${user.rol}-test-token`);
  win.localStorage.setItem('chamba_user', JSON.stringify(user));
}

Cypress.Commands.add('mockApi', () => {
  cy.intercept('GET', '**/api/services*', { statusCode: 200, body: { data: services } }).as('getServices');
  cy.intercept('GET', '**/api/categories', { statusCode: 200, body: { data: categories } }).as('getCategories');
  cy.intercept('GET', '**/api/users/profile', (req) => {
    const isProvider = req.headers.authorization?.includes('prestador');
    req.reply({
      statusCode: 200,
      body: isProvider
        ? {
            ...providerUser,
            disponible: true,
            verificado: true,
            especialidad: 'Reparaciones del hogar',
            experienciaAnios: 4,
            zonaCobertura: 'CDMX',
          }
        : {
            ...clientUser,
            ubicacion: { ciudad: 'CDMX', estado: 'Ciudad de México' },
          },
    });
  }).as('getProfile');

  cy.intercept('GET', '**/api/dashboard/client', {
    statusCode: 200,
    body: {
      activeRequests: 1,
      favorites: 2,
      completedServices: 1,
      monthSpent: 850,
      upcoming: [],
    },
  }).as('getClientDashboard');

  cy.intercept('GET', '**/api/dashboard/provider', {
    statusCode: 200,
    body: {
      pendingRequests: 1,
      completedJobs: 6,
      rating: 4.7,
      reviews: 9,
      earnings: {
        monthTotal: 4200,
        weekTotal: 1200,
        monthlyGrowthPercent: 12,
        weekly: [
          { date: '2026-06-15', amount: 300 },
          { date: '2026-06-16', amount: 450 },
          { date: '2026-06-17', amount: 450 },
        ],
      },
    },
  }).as('getProviderDashboard');

  cy.intercept('GET', '**/api/requests/mine', { statusCode: 200, body: { data: requests } }).as('getRequests');
  cy.intercept('GET', '**/api/calificaciones', {
    statusCode: 200,
    body: { data: [{ id: 1, solicitud: { id: 202 } }] },
  }).as('getRatings');
  cy.intercept('GET', '**/api/provider/requests', { statusCode: 200, body: { data: providerRequests } }).as('getProviderRequests');
  cy.intercept('GET', '**/api/provider/jobs', { statusCode: 200, body: { data: providerJobs } }).as('getProviderJobs');
  cy.intercept('PATCH', '**/api/provider/jobs/*/status', { statusCode: 200, body: {} }).as('updateJobStatus');
  cy.intercept('PATCH', '**/api/provider/availability', {
    statusCode: 200,
    body: { ...providerUser, disponible: false },
  }).as('updateAvailability');
  cy.intercept('GET', '**/api/favorites', { statusCode: 200, body: { data: services.slice(0, 1) } }).as('getFavorites');
  cy.intercept('POST', '**/api/favorites/*', { statusCode: 201, body: {} }).as('addFavorite');
  cy.intercept('GET', '**/api/notifications', { statusCode: 200, body: [] }).as('getNotifications');
  cy.intercept('PATCH', '**/api/notifications/*', { statusCode: 200, body: {} }).as('readNotification');
  cy.intercept('GET', '**/api/conversations', { statusCode: 200, body: { data: conversations } }).as('getConversations');
  cy.intercept('GET', '**/api/conversations/*/messages', (req) => {
    const id = req.url.match(/conversations\/([^/]+)\/messages/)?.[1];
    req.reply({ statusCode: 200, body: { data: messagesByConversation[id] || [] } });
  }).as('getMessages');
  cy.intercept('POST', '**/api/conversations/*/messages', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        id: `sent-${Date.now()}`,
        senderId: clientUser.id,
        text: req.body.text,
      },
    });
  }).as('sendMessage');
  cy.intercept('PATCH', '**/api/conversations/*/read', { statusCode: 200, body: {} }).as('readConversation');
  cy.intercept('POST', '**/api/requests/*/payment', {
    statusCode: 201,
    body: { id: 501, amount: 350, status: 'pending', method: 'tarjeta' },
  }).as('createPayment');
  cy.intercept('PATCH', '**/api/requests/*/payment/confirm', {
    statusCode: 200,
    body: { id: 501, amount: 350, status: 'paid', method: 'tarjeta' },
  }).as('confirmPayment');
  cy.intercept('GET', '**/api/provider/earnings/summary*', {
    statusCode: 200,
    body: {
      monthTotal: 4200,
      weekTotal: 1200,
      availableBalance: 2800,
      monthlyGrowthPercent: 12,
      weekly: [
        { date: '2026-06-15', amount: 300 },
        { date: '2026-06-16', amount: 450 },
        { date: '2026-06-17', amount: 450 },
      ],
    },
  }).as('getEarnings');
  cy.intercept('GET', '**/api/provider/transactions', {
    statusCode: 200,
    body: {
      data: [
        {
          id: 601,
          monto: 700,
          estado: 'paid',
          solicitud: {
            cliente: { nombre: 'Cliente', apellido: 'Pago' },
            servicio: { titulo: 'Limpieza profunda' },
          },
        },
      ],
    },
  }).as('getTransactions');
});

Cypress.Commands.add('mockPendingPaymentRequest', () => {
  cy.intercept('GET', '**/api/requests/mine', {
    statusCode: 200,
    body: { data: [pendingPaymentRequest] },
  }).as('getRequests');
});

Cypress.Commands.add('loginAsClient', (path = '/client') => {
  cy.mockApi();
  cy.visit(path, {
    onBeforeLoad(win) {
      setAuth(win, clientUser);
    },
  });
});

Cypress.Commands.add('loginAsProvider', (path = '/provider') => {
  cy.mockApi();
  cy.visit(path, {
    onBeforeLoad(win) {
      setAuth(win, providerUser);
    },
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('chamba_token');
    win.localStorage.removeItem('chamba_user');
  });
  cy.visit('/');
});

/**
 * Simula error 500 del servidor en un endpoint específico.
 * Cumple 5.1: "Flujos de error críticos: ¿qué ve el usuario cuando el servidor falla?"
 */
Cypress.Commands.add('simulateServerError', (method, urlPattern, alias) => {
  cy.intercept(method, urlPattern, {
    statusCode: 500,
    body: { message: 'Internal Server Error', statusCode: 500 },
    delay: 100,
  }).as(alias ?? 'serverError');
});

/**
 * Verifica accesibilidad básica con cypress-axe en la página actual.
 * Cumple 5.2: "Verificación de accesibilidad básica incluida en los E2E críticos"
 */
Cypress.Commands.add('checkA11y', (context, options) => {
  const axeOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
    ...options,
  };
  const includedImpacts = options?.includedImpacts || ['critical', 'serious'];

  cy.readFile('node_modules/axe-core/axe.min.js').then((source) => {
    cy.window({ log: false }).then((win) => {
      if (!win.axe) {
        win.eval(source);
      }

      return win.axe.run(context || win.document, axeOptions).then(({ violations }) => {
        const filtered = violations.filter((violation) =>
          includedImpacts.includes(violation.impact),
        );

        expect(
          filtered,
          filtered
            .map((violation) =>
              `${violation.id}: ${violation.nodes.length} nodo(s) ${violation.nodes
                .map((node) => node.target.join(', '))
                .join(' | ')}`,
            )
            .join('\n'),
        ).to.have.length(0);
      });
    });
  });
});

Cypress.Commands.add('focusFirstInteractive', () => {
  cy.get('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    .filter(':visible:not(:disabled)')
    .first()
    .focus();
});
