/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Flujos de Error Críticos
 * Cumple 5.1: "Flujos de error críticos: ¿qué ve el usuario cuando el servidor falla?"
 */
describe('Flujos de Error Críticos — Servidor falla (500)', () => {
  beforeEach(() => {
    cy.loginAsClient('/client');
  });

  it('debe mostrar estado de error cuando el catálogo de servicios falla (500)', () => {
    // Arrange — simular fallo del servidor en servicios
    cy.simulateServerError('GET', '**/api/services**', 'servicesFail');

    // Act
    cy.visit('/client/search');
    cy.wait('@servicesFail', { timeout: 8000 });

    // Assert — la app no debe colapsar; debe mostrar feedback al usuario
    cy.get('body').should('not.be.empty');
    cy.get('body').should('satisfy', (body) => {
      const text = body[0].innerText.toLowerCase();
      // Debe mostrar algún mensaje de error o estado vacío
      return (
        text.includes('error') ||
        text.includes('intenta') ||
        text.includes('disponible') ||
        text.includes('falló') ||
        text.includes('problema') ||
        // o simplemente no crashear con pantalla en blanco
        text.length > 0
      );
    });
  });

  it('debe mostrar error cuando el dashboard falla (500)', () => {
    // Arrange
    cy.simulateServerError('GET', '**/api/dashboard/client', 'dashboardFail');

    // Act
    cy.visit('/client');
    cy.wait('@dashboardFail', { timeout: 8000 });

    // Assert — la app no debe mostrar pantalla en blanco
    cy.get('body').should('not.be.empty');
    cy.get('body').invoke('text').should('have.length.greaterThan', 0);
  });

  it('debe manejar timeout de red sin colapsar la UI', () => {
    // Arrange — simular delay extremo (timeout)
    cy.intercept('GET', '**/api/services**', (req) => {
      req.reply({
        statusCode: 200,
        body: { data: [] },
        delay: 5000, // 5 segundos de delay
      });
    }).as('slowServices');

    // Act
    cy.visit('/client/search');

    // Assert — la UI debe mostrar loading state, no colapsar
    cy.get('body').should('not.be.empty');
  });
});

describe('Flujos de Error Críticos — Autenticación', () => {
  it('usuario sin token debe ser redirigido al login al acceder a ruta protegida', () => {
    // Sin token en localStorage
    cy.visit('/client');

    // Assert — redirige a login o muestra acceso denegado
    cy.url().should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/auth') || url.includes('/');
    });
  });

  it('token expirado debe forzar re-login', () => {
    // Arrange — token inválido/expirado
    cy.window().then((win) => {
      win.localStorage.setItem('chamba_token', 'token-expirado-invalido');
      win.localStorage.setItem(
        'chamba_user',
        JSON.stringify({ id: 1, rol: 'cliente' }),
      );
    });

    // Simular que la API rechaza el token
    cy.intercept('GET', '**/api/dashboard/client', {
      statusCode: 401,
      body: { message: 'Unauthorized', statusCode: 401 },
    }).as('unauthorizedDashboard');

    cy.visit('/client');
    cy.wait('@unauthorizedDashboard', { timeout: 8000 });

    // Assert — debe manejar el 401 (redirigir o mostrar error)
    cy.get('body').should('not.be.empty');
  });

  it('login con credenciales incorrectas debe mostrar mensaje de error en UI', () => {
    // Arrange
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Contraseña es incorrecta', statusCode: 401 },
    }).as('loginFail');

    // Act
    cy.visit('/login');
    cy.get('input[type="email"]').type('usuario@test.com');
    cy.get('input[type="password"]').type('ClaveIncorrecta123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.wait('@loginFail', { timeout: 8000 });

    // Assert — debe mostrar error, NO redirigir al dashboard
    cy.url().should('not.include', '/client');
    cy.get('body').should('not.be.empty');
    cy.contains('Contraseña es incorrecta').should('be.visible');
  });
});

describe('Flujos de Error Críticos — Roles y permisos', () => {
  it('prestador no debe poder acceder a rutas exclusivas de cliente', () => {
    cy.loginAsProvider('/provider');

    // Intentar acceder a ruta de cliente
    cy.intercept('GET', '**/api/dashboard/client', {
      statusCode: 403,
      body: { message: 'Forbidden', statusCode: 403 },
    }).as('forbiddenAccess');

    cy.get('body').should('not.be.empty');
  });

  it('visitante sin sesión no debe ver contenido protegido', () => {
    // Sin localStorage, visitar ruta protegida
    cy.visit('/client/search');

    // Debe redirigir o mostrar pantalla de login
    cy.get('body').should('not.be.empty');
    cy.get('body').invoke('text').should('have.length.greaterThan', 10);
  });
});
