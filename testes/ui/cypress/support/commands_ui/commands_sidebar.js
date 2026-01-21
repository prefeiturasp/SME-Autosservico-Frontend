import { SIDEBAR } from '../locators/sidebar_locators'

Cypress.Commands.add('sidebar_deve_estar_visivel', () => {
  cy.get(SIDEBAR.ROOT).should('be.visible')
})

Cypress.Commands.add('sidebar_nao_deve_estar_visivel', () => {
  cy.get(SIDEBAR.ROOT)
    .should('have.class', 'hidden')
})

Cypress.Commands.add(
  'item_sidebar_deve_estar_ativo',
  (locator) => {

    cy.url().should('include', '/dashboard')
    cy.get(locator)
      .should('have.attr', 'data-active', 'true')
  }
)

Cypress.Commands.add('logo_sidebar_deve_estar_visivel', () => {
  cy.get(SIDEBAR.LOGO).should('be.visible')
})

Cypress.Commands.add('fechar_sidebar', () => {
  cy.get(SIDEBAR.CLOSE_BUTTON).click()
})

Cypress.Commands.add(
  'item_sidebar_deve_estar_visivel',
  (locator, titulo, descricao) => {

    cy.get(locator)
      .should('be.visible')
      .within(() => {
        cy.contains(titulo)
        cy.contains(descricao)
      })
  }
)
