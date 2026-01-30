import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Monitoramento_Auto_Servico_Localizadores from '../locators/monitoramento_locators'

const locators = new Monitoramento_Auto_Servico_Localizadores()

Given('que eu acesso o sistema', () => {
  cy.acessar_tela_login()
  cy.fecharOverlaySeExistir()
})


Then('devo ter acesso ao dashboard', () => {
  cy.url().should('include', '/dashboard')
})

When('clico no menu {string}', () => {

  cy.fecharOverlaySeExistir()

  cy.get(locators.botao_ascom, { timeout: 30000 })
    .first()
    .scrollIntoView()
    .click({ force: true })
})

When('seleciono o sistema {string}', () => {

  cy.fecharOverlaySeExistir()

  cy.xpath(locators.botao_sistema)
    .first()
    .click({ force: true })
})

Then('devo ver se há algum incidente no sistema', () => {
  cy.xpath(locators.status_sistema)
    .should('exist')
})
