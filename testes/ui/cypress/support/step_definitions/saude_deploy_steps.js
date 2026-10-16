import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// ========================
// CONTEXTO
// ========================

Given('que estou no dashboard', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
})

// ========================
// ABA SAÚDE DO DEPLOY
// ========================

Given('que estou na aba Saúde do deploy', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')

  cy.contains('[role="tab"]', 'Saúde do deploy', { timeout: 20000 })
    .should('be.visible')
    .click({ force: true })

  cy.contains('[role="tab"]', 'Saúde do deploy')
    .should('have.attr', 'aria-selected', 'true')
})

When('clico na aba {string}', (aba) => {
  cy.contains('[role="tab"]', aba, { timeout: 20000 })
    .should('be.visible')
    .click({ force: true })

  cy.contains('[role="tab"]', aba)
    .should('have.attr', 'aria-selected', 'true')
})

Then('a aba {string} deve estar selecionada', (aba) => {
  cy.contains('[role="tab"]', aba, { timeout: 20000 })
    .should('have.attr', 'aria-selected', 'true')
})

// ========================
// AMBIENTE
// ========================

Then('devo visualizar o ambiente {string}', (ambiente) => {
  cy.contains(ambiente, { timeout: 20000 })
    .should('be.visible')
})

// ========================
// CARDS
// ========================

Then('devo visualizar o card {string}', (card) => {
  cy.contains(card, { timeout: 20000 })
    .should('be.visible')
})

// ========================
// STATUS
// ========================

Then('devo visualizar o status {string}', (status) => {
  cy.contains(status, { timeout: 20000 })
    .should('be.visible')
})

Then('devo visualizar o status da avaliação {string}', (status) => {
  cy.contains(status, { timeout: 20000 })
    .should('be.visible')
})

// ========================
// INDICADORES
// ========================

Then('devo visualizar o indicador {string}', (indicador) => {
  cy.contains(indicador, { timeout: 20000 })
    .should('be.visible')
})

Then('o indicador {string} deve possuir valor', (indicador) => {
  cy.contains(indicador, { timeout: 20000 })
    .parent()
    .should('be.visible')
    .and('not.contain.text', '-')
})

// ========================
// NOTAS
// ========================

Then('devo visualizar a nota {string}', (nota) => {
  cy.contains(nota, { timeout: 20000 })
    .should('exist')
})

// ========================
// TEXTOS GENÉRICOS
// ========================

Then('devo visualizar o texto {string}', (texto) => {
  cy.contains(texto, {
    timeout: 20000,
    matchCase: false
  }).should('be.visible')
})

// ========================
// ESTABILIDADE
// ========================

Then('devo visualizar o valor de estabilidade', () => {
  cy.contains('%', { timeout: 20000 })
    .should('be.visible')
})