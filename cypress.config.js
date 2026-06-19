import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,                      // 5.2: screenshots y videos activados
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,                     // 5.2: retry límite 2 reintentos
      openMode: 0,
    },
    env: {
      apiUrl: 'http://localhost:3000/api',
      clientEmail: 'cliente@test.com',
      clientPassword: 'Test1234!',
      providerEmail: 'prestador@test.com',
      providerPassword: 'Test1234!',
    },

    setupNodeEvents(on) {
      /**
       * Task: resetDb
       * Cumple 5.2: "Limpieza de BD entre tests (endpoint de reset o seeders dedicados)"
       * Llama al endpoint de reset del backend (solo disponible en NODE_ENV=test).
       */
      on('task', {
        async resetDb() {
          const { default: fetch } = await import('node-fetch').catch(
            () => ({ default: globalThis.fetch }),
          );
          try {
            const res = await fetch('http://localhost:3000/api/test/reset', {
              method: 'POST',
              headers: { 'x-test-secret': 'cypress-reset-2026' },
            });
            return res.ok ? 'reset-ok' : `reset-failed:${res.status}`;
          } catch {
            // Backend no disponible en modo mock — no es error fatal
            return 'reset-skipped';
          }
        },
      });
    },
  },
});
