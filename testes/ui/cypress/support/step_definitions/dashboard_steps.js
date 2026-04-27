import { Then } from 'cypress-cucumber-preprocessor/steps'

Then('o card de {string} deve estar visível', (card) => {

  const mapa = {
    'Lançamentos': () => cy.card_lancamentos_visivel(),
    'Disponibilidade do ambiente': () => cy.card_disponibilidade_visivel(),
    'Saúde do servidor': () => cy.card_saude_servidor_visivel(),
    'Banco de dados': () => cy.card_banco_dados_visivel(),
    'Bugs': () => cy.card_bugs_visivel()
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