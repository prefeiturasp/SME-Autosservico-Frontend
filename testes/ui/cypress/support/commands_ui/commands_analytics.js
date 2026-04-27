import { ANALYTICS } from '../locators/analytics_locators'
require('cypress-xpath')

// ========================
// ABA ANALYTICS
// ========================

Cypress.Commands.add('validarAbaAnalytics', () => {
  cy.get(ANALYTICS.TABS.ANALYTICS_TAB)
    .should('have.attr', 'aria-selected', 'true')
})

// NOVO COMMAND (do teste que você pediu)
Cypress.Commands.add('localizarAbaAnalytics', () => {
  cy.contains('[role="tab"]', 'Analytics')
    .as('abaAnalytics')
})

Cypress.Commands.add('validarAbaAnalyticsVisivel', () => {
  cy.get('@abaAnalytics').should('be.visible')
})

Cypress.Commands.add('validarAbaAnalyticsSelecionada', () => {
  cy.get('@abaAnalytics')
    .should('have.attr', 'aria-selected', 'true')
})

// ========================
// CARDS
// ========================

Cypress.Commands.add('validarCardsPrincipais', () => {
  cy.get(ANALYTICS.CARDS.USUARIOS_ATIVOS).should('be.visible')
  cy.get(ANALYTICS.CARDS.MEDIA_SESSAO).should('be.visible')
})

// ========================
// TABELA
// ========================

Cypress.Commands.add('validarUsuariosPorPagina', () => {
  cy.get(ANALYTICS.USERS_BY_PAGE.CARD).should('be.visible')

  cy.get(ANALYTICS.USERS_BY_PAGE.SORT_DESCRICAO).should('exist')
  cy.get(ANALYTICS.USERS_BY_PAGE.SORT_ACESSO).should('exist')

  cy.get(ANALYTICS.USERS_BY_PAGE.ROW)
    .should('have.length.greaterThan', 0)
})

// ========================
// DISPOSITIVOS
// ========================

Cypress.Commands.add('validarDispositivos', () => {
  cy.get(ANALYTICS.DEVICE.CARD).should('be.visible')

  cy.get(ANALYTICS.DEVICE.DESKTOP_BAR).should('be.visible')
  cy.get(ANALYTICS.DEVICE.MOBILE_BAR).should('be.visible')
  cy.get(ANALYTICS.DEVICE.TABLET_BAR).should('be.visible')
})

// ========================
// ALERTA
// ========================

Cypress.Commands.add('validarAlertaMobile', () => {
  cy.get(ANALYTICS.ALERT.WARNING).should('be.visible')
})

// ========================
// HORÁRIOS
// ========================

Cypress.Commands.add('validarHorariosDePico', () => {
  cy.get(ANALYTICS.HORARIOS.CARD).should('be.visible')
  cy.get(ANALYTICS.HORARIOS.PICO_LABEL)
    .should('contain', 'Pico:')
})