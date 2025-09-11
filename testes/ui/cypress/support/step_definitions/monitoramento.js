import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Auto_Servico_Localizadores from '../locators/login_locators'
import Monitoramento_Auto_Servico_Localizadores from '../locators/monitoramento_locators'

const locators = new Login_Auto_Servico_Localizadores()
const locators_monitoramento = new Monitoramento_Auto_Servico_Localizadores()


Given(/^que eu estou na página de login$/, () => {
  cy.login_autoservico()
})

When(/^eu insiro o RF "([^"]*)" e senha "([^"]*)"$/, (rf, senha) => {
  if (rf) {
    cy.get(locators.campo_usuario()).clear().type(rf)
  } else {
    cy.get(locators.campo_usuario()).clear()
  }

  if (senha) {
    cy.get(locators.campo_senha()).clear().type(senha)
  } else {
    cy.get(locators.campo_senha()).clear()
  }
})

When(/^clico no botão de Entrar$/, () => {
  cy.get('button')
    .filter((_, el) => el.innerText.trim() === 'Entrar')
    .click()
})

Then(/^devo ter acesso ao dashboard$/, () => {
  cy.url().should('include', '/dashboard')
})

When(/^clico no menu COTIC$/, () => {
  cy.get(locators_monitoramento.botao_cotic()).click()
})

When(/^seleciono o sistema Autosserviço$/, () => {
  cy.xpath(locators_monitoramento.botao_sistema()).click()
  cy.xpath(locators_monitoramento.opcao_sistema()).should('be.visible')
  .click({ force: true });
})

Then(/^devo ver se há algum incidente no sistema$/, () => {
  cy.xpath(locators_monitoramento.status_sistema()).should('be.visible')
})

