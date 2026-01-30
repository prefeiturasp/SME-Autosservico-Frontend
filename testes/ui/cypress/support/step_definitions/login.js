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
