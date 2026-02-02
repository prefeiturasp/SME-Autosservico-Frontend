import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { SIDEBAR } from '../locators/sidebar_locators'

Given('que eu acesso o sistema', () => {
  cy.acessar_tela_login()
  cy.fecharOverlaySeExistir()
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

    if (!rf || !senha) {
      throw new Error(`Massa não encontrada: rf=${tipo_rf}, senha=${tipo_senha}`)
    }

    cy.dados_de_login(rf, senha)
  }
)

When('clico no botão de acessar', () => {
  cy.botao_acessar().click()
  cy.fecharOverlaySeExistir()
})

Then('o sidebar deve estar visível', () => {
  cy.get(SIDEBAR.ROOT, { timeout: 30000 })
    .should('exist')
})

Then('o sidebar não deve estar visível', () => {
  cy.get(SIDEBAR.ROOT)
    .should('exist')
    .and('not.be.visible')
})


Then('o logo do AutoServiço deve estar visível', () => {
  cy.get(SIDEBAR.LOGO)
    .should('exist')
})

When('eu clico no botão de fechar do sidebar', () => {
  cy.get(SIDEBAR.CLOSE_BUTTON, { timeout: 20000 })
    .first()
    .click({ force: true })
})

Then('devo visualizar todos os itens do menu do sidebar', () => {

  const itens = [
    { locator: SIDEBAR.MENU.ASCOM, titulo: 'ASCOM' },
    { locator: SIDEBAR.MENU.CODAE, titulo: 'CODAE' },
    { locator: SIDEBAR.MENU.COPED, titulo: 'COPED' },
    { locator: SIDEBAR.MENU.COPLAN, titulo: 'COPLAN' },
    { locator: SIDEBAR.MENU.COTIC, titulo: 'COTIC' },
    { locator: SIDEBAR.MENU.COGEP, titulo: 'COGEP' }
  ]

  itens.forEach(({ locator, titulo }) => {
    cy.get(locator, { timeout: 30000 })
      .first()
      .should('exist')
      .contains(titulo)
  })
})

When('clico no item {string} do sidebar', (item) => {

  const mapa = {
    ASCOM: SIDEBAR.MENU.ASCOM,
    CODAE: SIDEBAR.MENU.CODAE,
    COPED: SIDEBAR.MENU.COPED,
    COPLAN: SIDEBAR.MENU.COPLAN,
    COTIC: SIDEBAR.MENU.COTIC,
    COGEP: SIDEBAR.MENU.COGEP
  }

  const locator = mapa[item]

  if (!locator) {
    throw new Error(`Item de sidebar não mapeado: ${item}`)
  }

  cy.get(locator, { timeout: 30000 })
    .first()
    .scrollIntoView()
    .click({ force: true })
})

Then('o item {string} deve estar ativo no sidebar', (item) => {

  const mapa = {
    ASCOM: SIDEBAR.MENU.ASCOM,
    CODAE: SIDEBAR.MENU.CODAE,
    COPED: SIDEBAR.MENU.COPED,
    COPLAN: SIDEBAR.MENU.COPLAN,
    COTIC: SIDEBAR.MENU.COTIC,
    COGEP: SIDEBAR.MENU.COGEP
  }

  const locator = mapa[item]

  cy.get(locator)
    .first()
    .should('have.attr', 'data-active', 'true')
})
