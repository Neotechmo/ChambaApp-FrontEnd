/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Compatibilidad de Navegadores y Dispositivos
 * Cumple 8.2: "Tests de Cypress ejecutados en múltiples viewports"
 *
 * Viewports cubiertos:
 *   - Desktop:  1280×720
 *   - Tablet:   768×1024  (iPad)
 *   - Móvil:    390×844   (iPhone 14)
 */

const viewports = [
  { name: 'Desktop (1280×720)', width: 1280, height: 720 },
  { name: 'Tablet iPad (768×1024)', width: 768, height: 1024 },
  { name: 'Móvil iPhone 14 (390×844)', width: 390, height: 844 },
];

viewports.forEach(({ name, width, height }) => {
  describe(`Compatibilidad — ${name}`, () => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    context('Página de Login', () => {
      beforeEach(() => {
        cy.mockApi();
        cy.visit('/login');
      });

      it(`[${name}] el formulario de login es visible y usable`, () => {
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.contains('button', 'Iniciar sesión').should('be.visible');
      });

      it(`[${name}] el botón de login es accesible (no está fuera del viewport)`, () => {
        cy.contains('button', 'Iniciar sesión').then(($btn) => {
          const rect = $btn[0].getBoundingClientRect();
          expect(rect.top).to.be.gte(0);
          expect(rect.left).to.be.gte(0);
          expect(rect.bottom).to.be.lte(height + 1);
        });
      });
    });

    context('Dashboard Cliente', () => {
      beforeEach(() => {
        cy.loginAsClient('/client');
      });

      it(`[${name}] el dashboard carga sin overflow horizontal`, () => {
        cy.document().then((doc) => {
          // No debe haber scroll horizontal (indica layout roto)
          expect(doc.documentElement.scrollWidth).to.be.lte(width + 20);
        });
      });

      it(`[${name}] el contenido principal es visible en pantalla`, () => {
        cy.get('body').should('not.be.empty');
        cy.get('body').invoke('text').should('have.length.greaterThan', 10);
      });
    });

    context('Catálogo de Servicios', () => {
      beforeEach(() => {
        cy.loginAsClient('/client/search');
      });

      it(`[${name}] la página de búsqueda carga correctamente`, () => {
        cy.get('body').should('not.be.empty');
      });
    });
  });
});
