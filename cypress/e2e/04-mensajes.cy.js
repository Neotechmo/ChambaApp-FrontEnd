/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Mensajes / Chat
 * Nota: Los WebSockets no se pueden interceptar directamente con cy.intercept().
 *       Se validan los elementos UI y las peticiones REST del módulo.
 */
describe('Módulo de Mensajes', () => {
  beforeEach(() => {
    cy.loginAsClient();
  });

  it('debe poder navegar al módulo de mensajes', () => {
    cy.visit('/client/messages');
    cy.url().should('include', '/client/messages');
    cy.contains('Mensajes').should('be.visible');
    cy.contains('Prestador Uno').should('be.visible');
  });

  it('debe mostrar solo las conversaciones del usuario autenticado', () => {
    cy.visit('/client/messages');
    cy.wait('@getConversations', { timeout: 10000 }).then((interception) => {
      // La respuesta debe ser un array (puede estar vacío)
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.contains('Prestador Uno').should('be.visible');
    cy.contains('Prestador Dos').should('be.visible');
    cy.contains('Cliente Ajeno').should('not.exist');
  });

  it('el campo de texto de un chat debe limpiarse al cambiar de conversación (bug #009)', () => {
    cy.visit('/client/messages');
    cy.contains('Prestador Uno').should('be.visible');

    cy.contains('.conversation-item', 'Prestador Uno').click();
    cy.get('input[placeholder="Escribe un mensaje..."]')
      .type('Mensaje de prueba que no debe persistir');

    cy.contains('.conversation-item', 'Prestador Dos').click();

    cy.get('input[placeholder="Escribe un mensaje..."]')
      .should('have.value', '');
  });
});
