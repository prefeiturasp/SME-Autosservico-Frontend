import { DASHBOARD } from '../locators/dashboard_locators'

Cypress.Commands.add('card_lancamentos_visivel', () => {
  cy.get(DASHBOARD.LANCAMENTOS.ROOT).should('be.visible')
})

Cypress.Commands.add('validar_lancamentos', () => {
  cy.contains('Lançamentos', { timeout: 30000 }).should('be.visible')

  cy.contains('Produção').should('be.visible')

  // aqui removemos o within e buscamos na tela inteira
  cy.contains(/Realizado em/i).should('be.visible')

  cy.contains(/v\d+/).should('exist')
})

Cypress.Commands.add('card_disponibilidade_visivel', () => {
  cy.get(DASHBOARD.DISPONIBILIDADE.ROOT).should('be.visible')
})

Cypress.Commands.add('status_disponivel', () => {
  cy.get(DASHBOARD.DISPONIBILIDADE.STATUS).should('be.visible')
})

Cypress.Commands.add('card_saude_servidor_visivel', () => {
  cy.get(DASHBOARD.SAUDE_SERVIDOR.ROOT).should('be.visible')
})

Cypress.Commands.add('validar_saude_servidor', () => {
  cy.get(DASHBOARD.SAUDE_SERVIDOR.ROOT).within(() => {
    cy.contains('Fila').should('be.visible')
    cy.contains('API Service').should('be.visible')
  })
})

Cypress.Commands.add('card_banco_dados_visivel', () => {
  cy.get(DASHBOARD.BANCO_DADOS.ROOT).should('be.visible')
})

Cypress.Commands.add('status_banco_disponivel', () => {
  cy.get(DASHBOARD.BANCO_DADOS.STATUS).should('be.visible')
})

Cypress.Commands.add('card_bugs_visivel', () => {
  cy.get(DASHBOARD.BUGS.ROOT).should('be.visible')
})

Cypress.Commands.add('tabela_bugs_deve_conter_registros', () => {
  cy.get(DASHBOARD.BUGS.LINHAS).its('length').should('be.greaterThan', 0)
})

Cypress.Commands.add('card_usuarios_com_acesso_visivel', () => {
  cy.get(DASHBOARD.USUARIOS_COM_ACESSO.TITULO).should('be.visible')
})

Cypress.Commands.add('validar_colunas_tabela_bugs', (colunas) => {
  cy.get(DASHBOARD.BUGS.ROOT).within(() => {
    colunas.forEach((coluna) => {
      cy.get(DASHBOARD.BUGS.CABECALHO).contains(coluna).should('be.visible')
    })
  })
})

Cypress.Commands.add('validar_indicadores_bugs', (indicadores) => {
  cy.get(DASHBOARD.BUGS.ROOT).within(() => {
    indicadores.forEach((indicador) => {
      cy.contains(indicador).should('be.visible')
    })
  })
})

Cypress.Commands.add('tabela_bugs_possui_mais_registros', () => {
  cy.get(DASHBOARD.BUGS.ROOT)
    .find(DASHBOARD.BUGS.BOTAO_EXIBIR_MAIS)
    .should('be.visible')
})

Cypress.Commands.add('clicar_exibir_mais_bugs', () => {
  cy.get(DASHBOARD.BUGS.ROOT)
    .find(DASHBOARD.BUGS.BOTAO_EXIBIR_MAIS)
    .click()
})