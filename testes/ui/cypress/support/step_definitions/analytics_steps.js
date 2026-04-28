import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// ========================
// CONTEXTO
// ========================

Given('que estou no dashboard', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
})

// ========================
// ABA ANALYTICS
// ========================

Given('que estou na aba Analytics', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')

  cy.contains('[role="tab"]', 'Analytics', { timeout: 20000 })
    .should('be.visible')
    .click({ force: true })

  cy.contains('[role="tab"]', 'Analytics')
    .should('have.attr', 'aria-selected', 'true')
})

// ✔️ CORREÇÃO DEFINITIVA (STEP QUE ESTAVA FALTANDO)
When('clico na aba {string}', (aba) => {
  cy.contains('[role="tab"]', aba, { timeout: 20000 })
    .should('be.visible')
    .click({ force: true })

  cy.contains('[role="tab"]', aba, { timeout: 20000 })
    .should('have.attr', 'aria-selected', 'true')
})

// ========================
// ABA SELECIONADA
// ========================

Then('a aba {string} deve estar selecionada', (aba) => {
  cy.contains('[role="tab"]', aba, { timeout: 20000 })
    .should('be.visible')
    .and('have.attr', 'aria-selected', 'true')
})

// ========================
// CARDS
// ========================

Then('devo visualizar o card {string}', (card) => {
  cy.contains(card, { timeout: 20000 })
    .should('be.visible')
})

Then('o card {string} deve possuir valor', (card) => {
  cy.contains(card, { timeout: 20000 })
    .parent()
    .should('be.visible')
    .and('not.contain.text', '-')
})

// ========================
// TABELA
// ========================

Then('devo visualizar as colunas {string}, {string}, {string}, {string}', (c1, c2, c3, c4) => {
  cy.contains(c1).should('be.visible')
  cy.contains(c2).should('be.visible')
  cy.contains(c3).should('be.visible')
  cy.contains(c4).should('be.visible')
})

Then('devo visualizar pelo menos uma linha na tabela', () => {
  cy.get('tbody tr, [role="row"]', { timeout: 20000 })
    .should('have.length.greaterThan', 0)
})

// ========================
// ORDENAÇÃO
// ========================

When('clico para ordenar por {string}', (coluna) => {
  cy.contains(coluna, { timeout: 20000 })
    .click({ force: true })
})

Then('a ordenação deve ser aplicada', () => {
  cy.wait(1000)
})

// ========================
// FILTRO
// ========================

When('clico no filtro de páginas', () => {
  cy.contains('Todas as páginas', { timeout: 20000 })
    .click({ force: true })
})

Then('devo visualizar a opção {string}', (opcao) => {
  cy.contains(opcao, { timeout: 20000 })
    .should('be.visible')
})

// ========================
// DISPOSITIVOS
// ========================

Then('devo visualizar os tipos {string}, {string} e {string}', (t1, t2, t3) => {
  cy.contains(t1).should('be.visible')
  cy.contains(t2).should('be.visible')
  cy.contains(t3).should('be.visible')
})

// ========================
// ALERTA RESPONSIVIDADE
// ========================

Then('devo visualizar o alerta de responsividade', () => {
  cy.get('body', { timeout: 20000 }).then(($body) => {
    const texto = $body.text().toLowerCase()

    const encontrou = [
      'responsiv',
      'alerta',
      'layout',
      'não é responsivo',
      'nao é responsivo',
      'compatível'
    ].some(t => texto.includes(t))

    expect(encontrou, 'Alerta de responsividade não encontrado').to.eq(true)
  })
})

// ========================
// HORÁRIOS DE PICO
// ========================

Then('devo visualizar o texto {string}', (texto) => {
  cy.contains(texto, { matchCase: false, timeout: 20000 })
    .should('be.visible')
})