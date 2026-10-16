import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const INDICADORES_ACESSO = [
  'Usuários com acesso ativo',
  'Usuários únicos por dia',
  'Total de acessos ao sistema hoje'
]

const STATUS_SORTEIOS = ['Cadastrados', 'Realizados', 'Ativos', 'Encerrados']
const STATUS_OPORTUNIDADES = [
  'Oportunidades cadastradas',
  'CVs cadastrados',
  'Inscrições realizadas',
  'Contratações efetivadas'
]

const localizarTitulo = (titulo) =>
  cy.contains(titulo, { timeout: 20000, matchCase: false }).should('be.visible')

const fecharSobreposicaoAberta = () => {
  cy.fecharModalBoasVindasSeExistir()

  cy.get('body', { timeout: 10000 })
    .should('not.have.attr', 'data-scroll-locked')
}

Given('que estou no dashboard', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
})

Given('que estou na aba Métricas', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
  fecharSobreposicaoAberta()

  cy.contains('[role="tab"]', /^Métricas$/i, { timeout: 20000 })
    .should('be.visible')
    .click()
    .should('have.attr', 'aria-selected', 'true')
})

When('acesso a aba {string} do dashboard', (aba) => {
  fecharSobreposicaoAberta()

  cy.contains('[role="tab"]', new RegExp(`^${aba}$`, 'i'), { timeout: 20000 })
    .should('be.visible')
    .click()
})

Then('a aba {string} deve estar ativa', (aba) => {
  cy.contains('[role="tab"]', new RegExp(`^${aba}$`, 'i'), { timeout: 20000 })
    .should('have.attr', 'aria-selected', 'true')
})

Then('devo visualizar o seletor {string}', (rotulo) => {
  localizarTitulo(rotulo)
  cy.get('select, [role="combobox"], button[aria-haspopup="listbox"]', { timeout: 20000 })
    .filter(':visible')
    .should('have.length.at.least', 1)
})

Then('devo visualizar a instrução {string}', (instrucao) => {
  localizarTitulo(instrucao)
})

Then('devo visualizar os indicadores de acesso', () => {
  INDICADORES_ACESSO.forEach(localizarTitulo)
})

Then('cada indicador de acesso deve exibir um valor numérico', () => {
  INDICADORES_ACESSO.forEach((indicador) => {
    cy.contains(indicador, { timeout: 20000 })
      .parentsUntil('body')
      .filter((_, elemento) => /\d/.test(elemento.innerText))
      .first()
      .invoke('text')
      .should('match', /\d/)
  })
})

Then('devo visualizar a seção {string}', (secao) => {
  localizarTitulo(secao)
})

Then('devo visualizar o resumo de status de sorteios', () => {
  STATUS_SORTEIOS.forEach(localizarTitulo)
})

Then('devo visualizar o resumo de status de ordens de inscrição', () => {
  STATUS_SORTEIOS.forEach(localizarTitulo)
})

Then('devo visualizar a tabela {string}', (titulo) => {
  localizarTitulo(titulo)
})

When('seleciono o período {string} na seção {string}', (periodo, secao) => {
  localizarTitulo(secao)
  cy.contains(new RegExp(`^${periodo}$`, 'i'), { timeout: 20000 })
    .filter(':visible')
    .first()
    .click()
})

Then('o período {string} deve estar disponível na seção {string}', (periodo, secao) => {
  localizarTitulo(secao)
  cy.contains(new RegExp(`^${periodo}$`, 'i'), { timeout: 20000 })
    .filter(':visible')
    .should('have.length.at.least', 1)
})

When('solicito mais DREs na tabela {string}', (titulo) => {
  localizarTitulo(titulo)
  cy.contains('button', /Ver mais DREs/i, { timeout: 20000 })
    .filter(':visible')
    .first()
    .click()
})

Then('a tabela {string} deve conter ao menos uma linha', (titulo) => {
  localizarTitulo(titulo)
  cy.get('tbody tr', { timeout: 20000 })
    .filter(':visible')
    .should('have.length.at.least', 1)
})

Then('devo visualizar o filtro de mês na tabela {string}', (titulo) => {
  localizarTitulo(titulo)
  cy.get('select, [role="combobox"], button[aria-haspopup="listbox"]', { timeout: 20000 })
    .filter(':visible')
    .should('have.length.at.least', 1)
})

Then('devo visualizar os indicadores de oportunidades e recrutamento', () => {
  STATUS_OPORTUNIDADES.forEach(localizarTitulo)
})
