import LoginLocators from '../locators/login_locators'

const login = new LoginLocators()

Cypress.Commands.add('acessar_tela_login', () => {
  cy.visit('/')
})

Cypress.Commands.add('dados_de_login', (rf, senha) => {

  if (rf !== undefined) {
    cy.get(login.campo_usuario())
      .should('be.visible')
      .clear()
      .type(rf)
  }

  if (senha !== undefined) {
    cy.get(login.campo_senha())
      .should('be.visible')
      .clear()
      .type(senha)
  }
})

Cypress.Commands.add('botao_acessar', () => {
  return cy.get(login.botao_acessar())
})
