import { SAUDE_DEPLOY } from '../locators/saude_deploy_locators'

require('cypress-xpath')

// ========================
// ABA SAÚDE DO DEPLOY
// ========================

Cypress.Commands.add('validarAbaSaudeDeploy', () => {
  cy.contains('[role="tab"]', 'Saúde do deploy', { timeout: 20000 })
    .should('have.attr', 'aria-selected', 'true')
})

Cypress.Commands.add('localizarAbaSaudeDeploy', () => {
  cy.contains('[role="tab"]', 'Saúde do deploy')
    .as('abaSaudeDeploy')
})

Cypress.Commands.add('validarAbaSaudeDeployVisivel', () => {
  cy.get('@abaSaudeDeploy').should('be.visible')
})

Cypress.Commands.add('validarAbaSaudeDeploySelecionada', () => {
  cy.get('@abaSaudeDeploy')
    .should('have.attr', 'aria-selected', 'true')
})

// ========================
// AMBIENTE
// ========================

Cypress.Commands.add('validarAmbienteProducaoMaster', () => {
  cy.contains('Produção - Master', { timeout: 20000 })
    .should('be.visible')
})

// ========================
// AMBIENTES
// ========================

Cypress.Commands.add('validarAmbientes', () => {
  cy.contains('Produção').should('be.visible')
  cy.contains('Homologação').should('be.visible')
  cy.contains('QA').should('be.visible')
})

// ========================
// JENKINS
// ========================

Cypress.Commands.add('validarCardJenkins', () => {
  cy.contains('Jenkins - Branches e Builds', { timeout: 20000 })
    .should('be.visible')

  cy.contains('Sucesso').should('be.visible')
  cy.contains('Estabilidade').should('be.visible')
  cy.contains('Último sucesso').should('be.visible')
  cy.contains('Última falha').should('be.visible')
  cy.contains('Build atual').should('be.visible')
  cy.contains('Iniciado em').should('be.visible')
})

Cypress.Commands.add('validarValorEstabilidade', () => {
  cy.contains('%', { timeout: 20000 })
    .should('be.visible')
})

// ========================
// SONARQUBE
// ========================

Cypress.Commands.add('validarCardSonar', () => {
  cy.contains('SonarQube - Indicadores de qualidade', { timeout: 20000 })
    .should('be.visible')

  cy.contains('Avaliação de qualidade')
    .should('be.visible')
})

Cypress.Commands.add('validarStatusReprovado', () => {
  cy.contains('Reprovado', { timeout: 20000 })
    .should('be.visible')
})

Cypress.Commands.add('validarInformacoesBranch', () => {
  cy.contains('Última análise:', { timeout: 20000 })
    .should('be.visible')

  cy.contains('Branch: master')
    .should('be.visible')
})

// ========================
// INDICADORES
// ========================

Cypress.Commands.add('validarIndicadoresQualidade', () => {
  cy.contains('Bugs').should('be.visible')
  cy.contains('Cobertura de testes').should('be.visible')
  cy.contains('Código duplicado').should('be.visible')
  cy.contains('Vulnerabilidades').should('be.visible')
  cy.contains('Code Smells').should('be.visible')
  cy.contains('Pontos de atenção em segurança').should('be.visible')
})

Cypress.Commands.add('validarIndicadorComValor', (indicador) => {
  cy.contains(indicador, { timeout: 20000 })
    .parent()
    .should('be.visible')
    .and('not.contain.text', '-')
})

Cypress.Commands.add('validarNotasIndicadores', () => {
  cy.contains('E').should('exist')
  cy.contains('A').should('exist')
  cy.contains('C').should('exist')
})