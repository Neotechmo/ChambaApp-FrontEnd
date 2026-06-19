/**
 * Page Object Model — Dashboard
 */
export class DashboardPage {
  get metricsSection() {
    return cy.get(
      '[data-cy="dashboard-metrics"], [data-testid="dashboard-metrics"], [class*="metric"], [class*="dashboard"]',
    );
  }

  get activeJobsList() {
    return cy.get(
      '[data-cy="active-jobs"], [data-testid="active-jobs"], [class*="trabajos"], [class*="active"]',
    );
  }

  get errorState() {
    return cy.get(
      '[data-cy="dashboard-error"], [data-testid="dashboard-error"], [role="alert"]',
    );
  }

  visit() {
    cy.visit('/dashboard');
    return this;
  }

  waitForLoad() {
    cy.intercept('GET', '**/dashboard**').as('getDashboard');
    this.visit();
    cy.wait('@getDashboard', { timeout: 10000 });
    return this;
  }

  expectLoaded() {
    cy.get('body').should('not.be.empty');
    return this;
  }
}
