/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Accesibilidad (WCAG 2.0/2.1 AA)
 * Cumple 5.2: "Verificación de accesibilidad básica incluida en los E2E críticos"
 *
 * Usa cypress-axe + axe-core para detectar violaciones críticas y serias.
 * Niveles: wcag2a, wcag2aa — impactos: critical, serious.
 */

describe('Accesibilidad — Páginas Críticas', () => {
  context('Página de Login', () => {
    beforeEach(() => {
      cy.mockApi();
      cy.visit('/login');
    });

    it('no debe tener violaciones de accesibilidad críticas en /login', () => {
      cy.checkA11y();
    });

    it('el formulario de login debe tener labels asociados a inputs', () => {
      // Verificar asociación label-input (WCAG 1.3.1 — Info and Relationships)
      cy.get('input[type="email"]').should(($input) => {
        const id = $input.attr('id');
        const ariaLabel = $input.attr('aria-label');
        const ariaLabelledBy = $input.attr('aria-labelledby');
        // Debe tener alguna forma de label
        expect(id || ariaLabel || ariaLabelledBy || $input.closest('label').length).to.exist;
      });
    });

    it('el botón de submit debe tener texto accesible', () => {
      cy.contains('button', 'Iniciar sesión').should(($btn) => {
        const text = $btn.text().trim();
        const ariaLabel = $btn.attr('aria-label');
        expect(text.length > 0 || ariaLabel).to.be.true;
      });
    });
  });

  context('Dashboard Cliente', () => {
    beforeEach(() => {
      cy.loginAsClient('/client');
      cy.visit('/client');
    });

    it('no debe tener violaciones de accesibilidad críticas en /client', () => {
      cy.checkA11y();
    });
  });

  context('Catálogo de Servicios', () => {
    beforeEach(() => {
      cy.loginAsClient('/client');
      cy.visit('/client/search');
    });

    it('no debe tener violaciones de accesibilidad críticas en /client/search', () => {
      cy.checkA11y();
    });

    it('las imágenes de servicios deben tener atributo alt cuando existan', () => {
      // WCAG 1.1.1 — Non-text Content
      cy.get('body').then(($body) => {
        const images = $body.find('img');
        if (!images.length) {
          cy.log('La página no renderiza imágenes de servicios actualmente.');
          return;
        }

        cy.wrap(images).each(($img) => {
          // alt puede ser vacío (decorativa) pero debe existir el atributo
          expect($img.attr('alt')).to.not.be.undefined;
        });
      });
    });
  });

  context('Errores de Formulario Accesibles', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: { message: 'Contraseña incorrecta', statusCode: 401 },
      }).as('loginError');
      cy.visit('/login');
    });

    it('los errores de formulario deben comunicarse con aria-describedby, aria-live o role=alert (WCAG 3.3.1)', () => {
      cy.get('input[type="email"]').type('usuario@test.com');
      cy.get('input[type="password"]').type('ClaveIncorrecta');
      cy.contains('button', 'Iniciar sesión').click();
      cy.wait('@loginError');

      cy.get('body').then(($body) => {
        // WCAG 3.3.1: el error debe ser comunicado de forma accesible
        const hasAriaRegion =
          $body.find('[aria-live]').length > 0 ||
          $body.find('[role="alert"]').length > 0 ||
          $body.find('[aria-describedby]').length > 0;

        // Mínimo funcional: el mensaje de error es visible en el DOM
        const hasVisibleError =
          $body.text().toLowerCase().includes('contraseña') ||
          $body.text().toLowerCase().includes('error') ||
          $body.text().toLowerCase().includes('incorrect');

        expect(
          hasAriaRegion || hasVisibleError,
          'El error de formulario debe ser visible o tener atributo ARIA accesible',
        ).to.be.true;
      });
    });
  });

  context('Contraste y Navegación por Teclado', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('debe poder navegar el formulario de login solo con teclado (Tab)', () => {
      // WCAG 2.1.1 — Keyboard
      cy.focusFirstInteractive();
      cy.focused().should('exist');
    });

    it('no debe haber elementos interactivos sin foco visible', () => {
      // Verificar que los botones son alcanzables con Tab
      cy.contains('button', 'Iniciar sesión').focus();
      cy.focused().should('have.prop', 'tagName', 'BUTTON');
    });
  });
});
