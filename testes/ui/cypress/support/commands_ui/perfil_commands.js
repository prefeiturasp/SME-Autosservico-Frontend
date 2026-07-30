import Perfil_Locators from '../locators/perfil_locators'

require('cypress-xpath')

const PERFIL = new Perfil_Locators()

// =====================================================
// OVERLAY / MODAL DE BOAS-VINDAS
// =====================================================

// Fecha, de forma resiliente, TODOS os overlays de modal (ex.: modal de
// boas-vindas) que possam estar sobrepostos na tela, um de cada vez,
// até que nenhum reste. Evita falha quando mais de um overlay é
// encontrado simultaneamente no DOM.
Cypress.Commands.add('fecharOverlaysPerfil', () => {

  const overlay = 'div[data-state="open"].fixed.inset-0'

  const fechar = (tentativas = 5) => {

    if (tentativas <= 0) {
      return
    }

    cy.get('body').then($body => {

      const $overlays = $body.find(overlay)

      if ($overlays.length === 0) {
        return
      }

      cy.wrap($overlays.first())
        .click({ force: true })

      cy.wait(300)

      fechar(tentativas - 1)

    })

  }

  fechar()

})

// =====================================================
// MENU PERFIL
// =====================================================

Cypress.Commands.add('abrirPerfil', () => {

  cy.location('pathname', { timeout: 60000 }).should('include', '/dashboard')

  cy.fecharOverlaysPerfil()

  cy.get(PERFIL.menuPerfil, { timeout: 30000 })
    .click({ force: true })

  cy.contains(PERFIL.tituloPagina, { timeout: 30000 })
    .should('be.visible')

})

// =====================================================
// TÍTULO
// =====================================================

Cypress.Commands.add('validarTituloPerfil', () => {

  cy.contains(PERFIL.tituloPagina, { timeout: 30000 })
    .should('be.visible')

})

// =====================================================
// CARD PRINCIPAL
// =====================================================

Cypress.Commands.add('validarCardUsuario', () => {

  cy.contains(PERFIL.contaAtiva, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarNomeUsuario', () => {

  cy.get(PERFIL.nomeUsuario, { timeout: 30000 })
    .should('be.visible')
    .invoke('text')
    .should('not.be.empty')

})

Cypress.Commands.add('validarUltimoAcesso', () => {

  cy.contains(PERFIL.ultimoAcesso, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarTempoSessao', () => {

  cy.contains(PERFIL.tempoSessao, { timeout: 30000 })
    .should('be.visible')

})

// =====================================================
// DADOS PESSOAIS
// =====================================================

Cypress.Commands.add('validarCardDadosPessoais', () => {

  cy.contains(PERFIL.cardDadosPessoais, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarCampoNomeCompleto', () => {

  cy.contains(PERFIL.nomeCompleto, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarCampoCPF', () => {

  cy.contains(PERFIL.cpf, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarCampoEmail', () => {

  cy.contains(PERFIL.email, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarCampoCargo', () => {

  cy.contains(PERFIL.cargo, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarCampoCoordenadoria', () => {

  cy.contains(PERFIL.coordenadoria, { timeout: 30000 })
    .should('be.visible')

})

// =====================================================
// VALORES DOS CAMPOS
// =====================================================

Cypress.Commands.add('validarCampoPossuiValor', (campo) => {

  cy.contains(campo, { timeout: 30000 })
    .parent()
    .invoke('text')
    .then(texto => {

      const valor = texto
        .replace(campo, '')
        .trim()

      expect(valor).to.not.equal('')
      expect(valor).to.not.equal(PERFIL.campoVazio)

    })

})

// =====================================================
// CPF
// =====================================================

Cypress.Commands.add('validarCpfMascarado', () => {

  cy.contains(PERFIL.cpf, { timeout: 30000 })
    .parent()
    .invoke('text')
    .then(texto => {

      expect(texto, 'CPF não está mascarado').to.match(/\d{3}\.\d{3}\.xxx-xx/i)

    })

})

// =====================================================
// ÁREAS DE ACESSO
// =====================================================

Cypress.Commands.add('validarCardAreas', () => {

  cy.contains(PERFIL.cardAreas, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('validarArea', (area) => {

  cy.contains(area, {
    timeout: 30000
  })
    .should('be.visible')

})

// =====================================================
// PERMISSÕES
// =====================================================

Cypress.Commands.add('validarPermissao', (permissao) => {

  cy.contains(permissao, {
    timeout: 30000
  })
    .should('be.visible')

})

// =====================================================
// BOTÃO
// =====================================================

Cypress.Commands.add('validarBotaoEncerrarSessao', () => {

  cy.get(PERFIL.botaoEncerrarSessao, { timeout: 30000 })
    .should('be.visible')

})

Cypress.Commands.add('clicarEncerrarSessao', () => {

  cy.get(PERFIL.botaoEncerrarSessao)
    .scrollIntoView()
    .click({ force: true })

})

// =====================================================
// BOTÕES (EM DESENVOLVIMENTO)
// =====================================================

Cypress.Commands.add('validarBotaoAlterarSenhaExiste', () => {

  cy.get(PERFIL.botaoAlterarSenha, { timeout: 30000 })
    .should('exist')

})

Cypress.Commands.add('validarBotaoEditarDadosExiste', () => {

  cy.get(PERFIL.botaoEditarDados, { timeout: 30000 })
    .should('exist')

})

// =====================================================
// STATUS DA CONTA
// =====================================================

Cypress.Commands.add('validarStatusContaPreenchido', () => {

  cy.get('body')
    .invoke('text')
    .then(texto => {

      const preenchido =
        texto.includes(PERFIL.statusContaAtiva) ||
        texto.includes(PERFIL.statusContaInativa)

      expect(preenchido, 'Status da conta não encontrado').to.eq(true)

    })

})

// =====================================================
// ÍCONES DAS ÁREAS
// =====================================================

Cypress.Commands.add('validarIconesDasAreas', () => {

  cy.contains(PERFIL.cardAreas, { timeout: 30000 })
    .parents('section')
    .find(PERFIL.iconeArea)
    .should('have.length.greaterThan', 0)

})
