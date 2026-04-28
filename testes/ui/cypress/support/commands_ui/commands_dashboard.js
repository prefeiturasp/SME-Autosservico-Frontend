import { DASHBOARD } from '../locators/dashboard_locators'

Cypress.Commands.add('card_lancamentos_visivel', () => {
  cy.get(DASHBOARD.LANCAMENTOS.ROOT).should('be.visible')
})

Cypress.Commands.add('validar_lancamentos', () => {
  cy.contains('Lançamentos', { timeout: 30000 }).should('be.visible')

  cy.contains('Produção').should('be.visible')

  // aqui removemos o within e buscamos na tela inteira
  cy.contains(/Realizado em/i).should('be.visible')

  cy.contains(/v\d+/).should('exist')
})

Cypress.Commands.add('card_disponibilidade_visivel', () => {
  cy.get(DASHBOARD.DISPONIBILIDADE.ROOT).should('be.visible')
})

Cypress.Commands.add('status_disponivel', () => {
  cy.get(DASHBOARD.DISPONIBILIDADE.STATUS).should('be.visible')
})

Cypress.Commands.add('card_saude_servidor_visivel', () => {
  cy.get(DASHBOARD.SAUDE_SERVIDOR.ROOT).should('be.visible')
})

Cypress.Commands.add('validar_saude_servidor', () => {
  cy.get(DASHBOARD.SAUDE_SERVIDOR.ROOT).within(() => {
    cy.contains('Fila').should('be.visible')
    cy.contains('API Service').should('be.visible')
  })
})

Cypress.Commands.add('card_banco_dados_visivel', () => {
  cy.get(DASHBOARD.BANCO_DADOS.ROOT).should('be.visible')
})

Cypress.Commands.add('status_banco_disponivel', () => {
  cy.get(DASHBOARD.BANCO_DADOS.STATUS).should('be.visible')
})

Cypress.Commands.add('card_bugs_visivel', () => {
  cy.get(DASHBOARD.BUGS.ROOT).should('be.visible')
})

Cypress.Commands.add('tabela_bugs_deve_conter_registros', () => {
  cy.get(DASHBOARD.BUGS.LINHAS).its('length').should('be.greaterThan', 0)
})