import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { SIDEBAR } from '../locators/sidebar_locators'

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

Then('o sidebar deve estar visível', () => {
  cy.sidebar_deve_estar_visivel()
})

Then('o sidebar não deve estar visível', () => {
  cy.sidebar_nao_deve_estar_visivel()
})

Then('o logo do AutoServiço deve estar visível', () => {
  cy.logo_sidebar_deve_estar_visivel()
})

Then('devo visualizar todos os itens do menu do sidebar', () => {

  const itens = [
    {
      locator: SIDEBAR.MENU.ASCOM,
      titulo: 'ASCOM',
      descricao: 'Assessoria de comunicação'
    },
    {
      locator: SIDEBAR.MENU.CODAE,
      titulo: 'CODAE',
      descricao: 'Coordenadoria de alimentação escolar'
    },
    {
      locator: SIDEBAR.MENU.COPED,
      titulo: 'COPED',
      descricao: 'Coordenadoria pedagógica'
    },
    {
      locator: SIDEBAR.MENU.COPLAN,
      titulo: 'COPLAN',
      descricao: 'Coordenadoria de Planejamento e Orçamento'
    },
    {
      locator: SIDEBAR.MENU.COTIC,
      titulo: 'COTIC',
      descricao: 'Coordenadoria de Tecnologia da Informação e Comunicação'
    },
    {
      locator: SIDEBAR.MENU.COGEP,
      titulo: 'COGEP',
      descricao: 'Coordenadoria de Gestão de Pessoas'
    }
  ]

  itens.forEach(({ locator, titulo, descricao }) => {
    cy.item_sidebar_deve_estar_visivel(locator, titulo, descricao)
  })
})

When('eu clico no botão de fechar do sidebar', () => {
  cy.fechar_sidebar()
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
    throw new Error(`Item do sidebar não mapeado: ${item}`)
  }

  cy.get(locator).click()
})

Then('o item {string} deve estar ativo no sidebar', (item) => {

  const mapa = {
    COPLAN: SIDEBAR.MENU.COPLAN
  }

  const locator = mapa[item]

  if (!locator) {
    throw new Error(`Item ativo não mapeado: ${item}`)
  }

  cy.item_sidebar_deve_estar_ativo(locator)
})