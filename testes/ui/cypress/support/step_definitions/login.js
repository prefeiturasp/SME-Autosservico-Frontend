import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import LoginLocators from '../locators/login_locators'

const login = new LoginLocators()

const massaLogin = {
  rf_valido: Cypress.env('RF_VALIDO'),
  senha_valida: Cypress.env('SENHA_VALIDA'),
  rf_invalido: Cypress.env('RF_INVALIDO'),
  senha_invalida: Cypress.env('SENHA_INVALIDA')
}

Given('que eu acesso o sistema', () => {
  cy.acessar_tela_login()
  cy.fecharModalBoasVindasSeExistir()
})

When(
  'eu informo o RF do tipo {string} e a senha do tipo {string}',
  (tipo_rf, tipo_senha) => {

    const rf = massaLogin[tipo_rf]
    const senha = massaLogin[tipo_senha]

    if (rf === undefined || senha === undefined) {
      throw new Error(`Massa não encontrada: ${tipo_rf} / ${tipo_senha}`)
    }

    cy.dados_de_login(rf, senha)
  }
)

When('clico no botão de acessar', () => {
  cy.botao_acessar().click()
})

Then(
  'o resultado esperado para o cenário {string} deve ser exibido',
  (cenario) => {

    if (cenario === 'Login válido padrão') {
      cy.url().should('not.include', '/login')
      cy.fecharModalBoasVindasSeExistir()
    }

    if (cenario === 'Login inválido') {
      cy.get(login.mensagem_erro())
        .should('be.visible')
    }
  }
)

Then('devo visualizar o formulário de login', () => {
  cy.contains('Boas vindas ao Autosserviço!', { timeout: 20000 })
    .should('be.visible')
  cy.get(login.campo_usuario()).should('be.visible')
  cy.get(login.campo_senha()).should('be.visible')
  cy.get('img[alt="Logo AutoServiço"]').should('be.visible')
  cy.get('img[alt="Logo Prefeitura de São Paulo"]').should('be.visible')
})

Then('o botão de entrar deve estar desabilitado', () => {
  cy.botao_acessar().should('be.disabled')
})

When('informo o RF {string} no formulário de login', (rf) => {
  cy.get(login.campo_usuario())
    .clear()
    .type(rf)
})

Then('o campo de RF deve conter {string}', (rf) => {
  cy.get(login.campo_usuario()).should('have.value', rf)
})

When('informo a senha {string} no formulário de login', (senha) => {
  cy.get(login.campo_senha())
    .clear()
    .type(senha)
})

When('alterno a visibilidade da senha', () => {
  cy.get('button[aria-label="Senha invisível."], button[aria-label="Senha visível"]')
    .should('be.visible')
    .click()
})

Then('o campo de senha deve estar visível e conter {string}', (senha) => {
  cy.get(login.campo_senha())
    .should('have.attr', 'type', 'text')
    .and('have.value', senha)
})

Then('o campo de senha deve estar oculto e conter {string}', (senha) => {
  cy.get(login.campo_senha())
    .should('have.attr', 'type', 'password')
    .and('have.value', senha)
})

Then('o campo de senha deve estar vazio', () => {
  cy.get(login.campo_senha()).should('have.value', '')
})
