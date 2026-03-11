import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import Banco_Dados_Localizadores from '../locators/banco_dados_locators'

const locators = new Banco_Dados_Localizadores()

Then('o card de banco de dados deve estar visível', () => {
  cy.get(locators.card_banco_dados, { timeout: 30000 })
    .should('be.visible')
})

When('clico no menu lateral {string}', (menu) => {
  cy.fecharOverlaySeExistir()

  const menuMap = {
    'ASCOM': locators.botao_ascom,
    'COTIC': locators.botao_cotic,
  }

  const seletor = menuMap[menu]

  cy.get(seletor, { timeout: 30000 })
    .first()
    .scrollIntoView()
    .click({ force: true })
})

When('seleciono o sistema {string} no select', (sistema) => {
  cy.fecharOverlaySeExistir()

  cy.get(locators.select_sistema, { timeout: 30000 })
    .first()
    .click({ force: true })

  cy.get(`[role="option"]`, { timeout: 10000 })
    .contains(sistema)
    .click({ force: true })
})

Then('devo ver o título {string} no card de banco de dados', (titulo) => {
  cy.get(locators.titulo_banco_dados, { timeout: 30000 })
    .first()
    .should('be.visible')
    .and('contain.text', titulo)
})

Then('devo ver o badge de status no card de banco de dados', () => {
  cy.get(locators.badge_status, { timeout: 30000 })
    .should('have.length.at.least', 1)
    .first()
    .should('be.visible')
})

Then('devo ver {int} badges de status no card de banco de dados', (quantidade) => {
  cy.get(locators.badge_status, { timeout: 30000 })
    .should('have.length', quantidade)
})

Then('devo ver a mensagem {string} no card', (mensagem) => {
  cy.get(locators.card_banco_dados, { timeout: 30000 })
    .should('contain.text', mensagem)
})
