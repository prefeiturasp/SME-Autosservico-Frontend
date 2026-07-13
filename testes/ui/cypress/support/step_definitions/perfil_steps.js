import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// =====================================================
// DASHBOARD
// =====================================================

Given('que já estou no dashboard após o login', () => {

  cy.location('pathname', {
    timeout: 60000
  }).should('include', '/dashboard')

})

// =====================================================
// PERFIL
// =====================================================

Given('que estou na tela Meu Perfil', () => {

  cy.abrirPerfil()

  cy.contains('Meu perfil', {
    timeout: 30000
  }).should('be.visible')

})

When('clico no item {string} do menu superior', (item) => {

  cy.fecharOverlaysPerfil()

  cy.contains(item, {
    timeout: 30000
  })
    .scrollIntoView()
    .click({ force: true })

})

Then('devo visualizar a tela {string}', (titulo) => {

  cy.contains(titulo, {
    timeout: 30000
  }).should('be.visible')

})

// =====================================================
// TÍTULO
// =====================================================

Then('devo visualizar o título {string}', (titulo) => {

  cy.contains(titulo, {
    timeout: 30000
  }).should('be.visible')

})

// =====================================================
// CARD USUÁRIO
// =====================================================

Then('devo visualizar o nome do usuário', () => {

  cy.validarNomeUsuario()

})

// =====================================================
// CARDS
// =====================================================

Then('devo visualizar o card de perfil {string}', (card) => {

  cy.contains(card, {
    timeout: 30000
  }).should('be.visible')

})

// =====================================================
// CAMPOS
// =====================================================

Then('devo visualizar o campo {string}', (campo) => {

  cy.contains(campo, {
    timeout: 30000
  }).should('be.visible')

})

// =====================================================
// VALORES DOS CAMPOS
// =====================================================

Then('o campo {string} deve possuir valor', (campo) => {

  cy.validarCampoPossuiValor(campo)

})

// =====================================================
// CPF
// =====================================================

Then('o CPF deve estar mascarado', () => {

  cy.validarCpfMascarado()

})

// =====================================================
// ÁREAS
// =====================================================

Then('devo visualizar a área {string}', (area) => {

  cy.contains(area, {
    timeout: 30000
  }).should('be.visible')

})

Then('deve existir pelo menos uma área cadastrada', () => {

  const areas = [
    'ASCOM',
    'CODAE',
    'COGEP',
    'COPED',
    'COPLAN',
    'COTIC',
    'GIPE'
  ]

  cy.get('body')
    .invoke('text')
    .then(texto => {

      const encontrou = areas.some(area =>
        texto.includes(area)
      )

      expect(
        encontrou,
        'Nenhuma área encontrada'
      ).to.eq(true)

    })

})

// =====================================================
// PERMISSÕES
// =====================================================

Then('devo visualizar a permissão {string}', (permissao) => {

  cy.contains(permissao, {
    timeout: 30000
  }).should('be.visible')

})

// =====================================================
// BOTÃO
// =====================================================

Then('devo visualizar o botão {string}', (botao) => {

  if (botao === 'Encerrar sessão') {
    cy.validarBotaoEncerrarSessao()
    return
  }

  cy.contains('button', botao, {
    timeout: 30000
  }).should('be.visible')

})

When('clico no botão {string}', (botao) => {

  if (botao === 'Encerrar sessão') {
    cy.clicarEncerrarSessao()
    return
  }

  cy.contains('button', botao, {
    timeout: 30000
  })
    .scrollIntoView()
    .click({ force: true })

})

// =====================================================
// LOGOUT
// =====================================================

Then('devo ser redirecionado para a tela de login', () => {

  cy.location('pathname', {
    timeout: 30000
  }).should(path => {

    expect(
      path.includes('/login') ||
      path === '/' ||
      path.includes('/auth')
    ).to.eq(true)

  })

})
