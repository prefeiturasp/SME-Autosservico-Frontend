import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const massaLogin = {
  rf_valido: Cypress.env('RF_VALIDO'),
  senha_valida: Cypress.env('SENHA_VALIDA'),

  rf_invalido: Cypress.env('RF_INVALIDO'),
  senha_invalida: Cypress.env('SENHA_INVALIDA'),

  rf_em_branco: '',
  senha_em_branco: ''
}

Given('que eu acesso o sistema', () => {
  cy.login_autoservico()
})

When(
  'eu informo o RF do tipo {string} e a senha do tipo {string}',
  (tipo_rf, tipo_senha) => {

    const rf = massaLogin[tipo_rf]
    const senha = massaLogin[tipo_senha]

    // proteção extra (evita undefined silencioso)
    if (rf === undefined || senha === undefined) {
      throw new Error(`Massa não encontrada: rf=${tipo_rf}, senha=${tipo_senha}`)
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

    switch (cenario) {
      case 'Login válido padrão':
        cy.url().should('not.include', 'login')
        break

      case 'Login inválido':
        cy.contains('Vamos tentar de novo?').should('be.visible')
        break

      default:
        throw new Error(`Cenário não mapeado: ${cenario}`)
    }
  }
)