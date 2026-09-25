import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Then('o card de {string} deve estar visível', (card) => {

  const mapa = {
    'Lançamentos': () => cy.card_lancamentos_visivel(),
    'Disponibilidade do ambiente': () => cy.card_disponibilidade_visivel(),
    'Saúde do servidor': () => cy.card_saude_servidor_visivel(),
    'Banco de dados': () => cy.card_banco_dados_visivel(),
    'Bugs': () => cy.card_bugs_visivel(),
    'Usuários com acesso': () => cy.card_usuarios_com_acesso_visivel()
  }

  mapa[card]()
})

Then('deve exibir a versão e data de realização', () => {
  cy.validar_lancamentos()
})

Then('o status do ambiente deve ser {string}', (status) => {
  cy.status_disponivel()
})

Then('deve exibir os serviços {string} e {string}', (s1, s2) => {
  cy.validar_saude_servidor()
})

Then('o banco deve estar com status {string}', (status) => {
  cy.status_banco_disponivel()
})

Then('a tabela de bugs deve conter registros', () => {
  cy.tabela_bugs_deve_conter_registros()
})

Then('a tabela de bugs deve exibir as colunas {string}, {string}, {string} e {string}', (c1, c2, c3, c4) => {
  cy.validar_colunas_tabela_bugs([c1, c2, c3, c4])
})

Then('devo visualizar os indicadores {string}, {string}, {string}, {string} e {string}', (i1, i2, i3, i4, i5) => {
  cy.validar_indicadores_bugs([i1, i2, i3, i4, i5])
})

Given('que a tabela de bugs possui mais registros do que o exibido', () => {
  cy.tabela_bugs_possui_mais_registros()
})

When('clico em {string} na tabela de bugs', (texto) => {
  cy.clicar_exibir_mais_bugs()
})

Then('a quantidade de linhas exibidas na tabela de bugs deve aumentar', () => {
  cy.get('#onboarding-bugs tbody tr').its('length').should('be.greaterThan', 10)
})