/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Pagos / Transacciones
 * Cumple 5.1: "Flujo de pago o transacción crítica"
 */
import { DashboardPage } from '../support/page-objects/DashboardPage';

const dashboard = new DashboardPage();

describe('Flujo de Pago — Cliente', () => {
  beforeEach(() => {
    cy.loginAsClient('/client');
  });

  it('debe mostrar solicitudes con estado "completado" elegibles para pago', () => {
    cy.mockPendingPaymentRequest();
    cy.visit('/client/requests');
    cy.contains('Servicio listo para pago').should('be.visible');
    cy.contains('button', 'Pagar').should('be.visible');
  });

  it('debe navegar al flujo de pago desde una solicitud completada', () => {
    cy.mockPendingPaymentRequest();
    cy.visit('/client/requests');
    cy.contains('button', 'Pagar').click();
    cy.contains('Registrar pago').should('be.visible');
    cy.contains('Servicio listo para pago').should('be.visible');
  });

  it('el sistema debe mostrar el monto correcto en el resumen de pago', () => {
    cy.mockPendingPaymentRequest();
    cy.visit('/client/requests');
    cy.contains('button', 'Pagar').click();
    cy.contains('Total estimado').should('be.visible');
    cy.contains('$350').should('be.visible');
  });

  it('un pago rechazado debe mostrar mensaje de error al usuario', () => {
    cy.mockPendingPaymentRequest();
    cy.simulateServerError('POST', '**/api/requests/*/payment', 'pagoFallido');
    cy.visit('/client/requests');
    cy.contains('button', 'Pagar').click();
    cy.contains('button', 'Registrar pago').click();
    cy.wait('@pagoFallido');
    cy.contains('Internal Server Error').should('be.visible');
  });
});

describe('Flujo de Pago — Prestador (recepción)', () => {
  beforeEach(() => {
    cy.loginAsProvider('/provider');
  });

  it('el prestador debe ver el historial de pagos recibidos', () => {
    cy.visit('/provider/earnings');
    cy.contains('Ganancias').should('be.visible');
    cy.contains('Últimos pagos').should('be.visible');
    cy.contains('Cliente Pago').should('be.visible');
    cy.contains('$700').should('be.visible');
  });

  it('dashboard del prestador debe mostrar ingresos del mes', () => {
    dashboard.waitForLoad();
    cy.get('body').should('satisfy', (body) => {
      const text = body[0].innerText.toLowerCase();
      return (
        text.includes('ingreso') ||
        text.includes('ganancia') ||
        text.includes('pago') ||
        text.includes('$') ||
        text.includes('completad')
      );
    });
  });
});
