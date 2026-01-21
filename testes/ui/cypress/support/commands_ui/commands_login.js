import Login_Auto_Servico_Localizadores from '../locators/login_locators'

const loginLocalizadores = new Login_Auto_Servico_Localizadores()

Cypress.Commands.add('login_autoservico', () => {
  cy.visit('/')

  cy.get(loginLocalizadores.campo_usuario(), { timeout: 10000 })
    .should('be.visible')
    .and('not.be.disabled')
})

Cypress.Commands.add('dados_de_login', (rf, senha) => {

  if (rf) {
    cy.get(loginLocalizadores.campo_usuario())
      .should('be.visible')
      .and('not.be.disabled')
      .clear()
      .type(rf, { delay: 50 })
  }

  if (senha) {
    cy.get(loginLocalizadores.campo_senha())
      .should('be.visible')
      .and('not.be.disabled')
      .clear()
      .type(senha, { delay: 50 })
  }
})

Cypress.Commands.add('botao_acessar', () => {
  return cy.get(loginLocalizadores.botao_acessar())
})