/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Autenticación (Login / Registro / Logout)
 */
describe('Autenticación', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.visit('/');
  });

  // ──────────────────────────────────────────────────────
  context('Login', () => {
    it('debe mostrar la página de login al entrar a la raíz', () => {
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-form"], form').should('exist');
    });

    it('debe permitir login con credenciales válidas de cliente', () => {
      cy.fixture('users').then((users) => {
        cy.intercept('POST', '**/api/auth/login', {
          statusCode: 200,
          body: {
            access_token: 'cliente-test-token',
            user: {
              id: 1,
              nombre: 'Cliente',
              apellido: 'Prueba',
              correo: users.client.correo,
              telefono: users.client.telefono,
              rol: 'cliente',
            },
          },
        }).as('loginRequest');

        cy.get('input[name="correo"], input[type="email"]')
          .type(users.client.correo);
        cy.get('input[name="password"], input[type="password"]')
          .type(users.client.password);
        cy.contains('button', 'Iniciar sesión').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/client');
        cy.window().its('localStorage.chamba_token').should('eq', 'cliente-test-token');
      });
    });

    it('debe mostrar error con credenciales inválidas', () => {
      cy.fixture('users').then((users) => {
        cy.intercept('POST', '**/api/auth/login', {
          statusCode: 401,
          body: { message: 'Credenciales inválidas' },
        }).as('loginFail');

        cy.get('input[name="correo"], input[type="email"]')
          .type(users.invalidUser.correo);
        cy.get('input[name="password"], input[type="password"]')
          .type(users.invalidUser.password);
        cy.contains('button', 'Iniciar sesión').click();

        cy.wait('@loginFail').its('response.statusCode').should('be.oneOf', [401, 400]);
        cy.url().should('include', '/login');
        cy.contains('Credenciales inválidas').should('be.visible');
      });
    });

    it('no debe permitir enviar el formulario con campos vacíos', () => {
      cy.contains('button', 'Iniciar sesión').click();
      // El formulario no debe haber enviado ninguna petición
      cy.url().should('include', '/login');
    });
  });

  // ──────────────────────────────────────────────────────
  context('Registro', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('debe mostrar el formulario de registro', () => {
      cy.get('form, [data-testid="register-form"]').should('exist');
    });

    it('debe registrar un nuevo usuario exitosamente', () => {
      const timestamp = Date.now();
      cy.intercept('POST', '**/api/auth/register', {
        statusCode: 201,
        body: { id: 99 },
      }).as('registerRequest');

      cy.get('input[name="nombre"]').type('NuevoUsuario');
      cy.get('input[name="apellido"]').type('Test');
      cy.get('input[name="correo"], input[type="email"]').type(`nuevo${timestamp}@test.com`);
      cy.get('input[name="telefono"]').type('55abc5123-4567');
      cy.get('input[name="telefono"]').should('have.value', '5551234567');
      cy.get('input[name="password"], input[type="password"]').first().type('Secure123!');
      cy.contains('button', 'Registrarme').click();

      cy.wait('@registerRequest').its('response.statusCode').should('be.oneOf', [200, 201]);
      cy.url().should('include', '/login');
    });

    it('debe mostrar error al intentar registrar correo duplicado', () => {
      cy.fixture('users').then((users) => {
        cy.intercept('POST', '**/api/auth/register', {
          statusCode: 409,
          body: { message: 'El correo ya está registrado' },
        }).as('dupRegister');

        cy.get('input[name="nombre"]').type('Dup');
        cy.get('input[name="apellido"]').type('User');
        cy.get('input[name="correo"], input[type="email"]').type(users.client.correo);
        cy.get('input[name="telefono"]').type('5550000000');
        cy.get('input[name="password"], input[type="password"]').first().type(users.client.password);
        cy.contains('button', 'Registrarme').click();

        cy.wait('@dupRegister').its('response.statusCode').should('eq', 409);
        cy.contains('El correo ya está registrado').should('be.visible');
      });
    });
  });

  // ──────────────────────────────────────────────────────
  context('Logout', () => {
    it('debe cerrar sesión y redirigir al login', () => {
      cy.loginAsClient();
      cy.url().should('include', '/client');

      cy.contains('button', 'Salir').click();
      cy.url().should('include', '/login');
      cy.window().its('localStorage.chamba_token').should('be.undefined');
    });
  });
});
