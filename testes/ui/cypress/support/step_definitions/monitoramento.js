import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Auto_Servico_Localizadores from '../locators/login_locators'
import Monitoramento_Auto_Servico_Localizadores from '../locators/monitoramento_locators'

const loginLocators = new Login_Auto_Servico_Localizadores()
const monitoramentoLocators = new Monitoramento_Auto_Servico_Localizadores()


Given('que eu acesso o sistema', () => {
  cy.login_autoservico()
})


When(
  'eu informo o RF do tipo {string} e a senha do tipo {string}',
  (tipo_rf, tipo_senha) => {

    const massaLogin = {
      rf_valido: Cypress.env('RF_VALIDO'),
      senha_valida: Cypress.env('SENHA_VALIDA'),

      rf_invalido: Cypress.env('RF_INVALIDO'),
      senha_invalida: Cypress.env('SENHA_INVALIDA')
    }

    const rf = massaLogin[tipo_rf]
    const senha = massaLogin[tipo_senha]

    // proteção extra (MESMO PADRÃO DO SIDEBAR)
    if (rf === undefined || senha === undefined) {
      throw new Error(`Massa não encontrada: rf=${tipo_rf}, senha=${tipo_senha}`)
    }

    cy.get(loginLocators.campo_usuario())
      .should('be.visible')
      .clear()
      .type(rf)

    cy.get(loginLocators.campo_senha())
      .should('be.visible')
      .clear()
      .type(senha)
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

Then('devo ter acesso ao dashboard', () => {
  cy.url().should('include', '/dashboard')
})


When('clico no menu {string}', (menu) => {
  const mapaMenu = {
    ASCOM: monitoramentoLocators.botao_ascom()
  }

  const locator = mapaMenu[menu]

  if (!locator) {
    throw new Error(`Menu não mapeado: ${menu}`)
  }

  cy.get(locator)
    .should('be.visible')
    .click()
})

When('seleciono o sistema {string}', (sistema) => {
  cy.xpath(monitoramentoLocators.botao_sistema())
    .should('be.visible')
    .click({ force: true })
})

Then('devo ver se há algum incidente no sistema', () => {
  cy.xpath(monitoramentoLocators.status_sistema())
    .should('exist')
})