Cypress.Commands.add('configurar_visualizacao', (device) => {
	switch (device) {
	case 'web':
		cy.viewport(1920, 1080)
		break
	default:
		break
	}
})

Cypress.Commands.add('fecharModalBoasVindasSeExistir', () => {
  cy.get('body').then(($body) => {
    const seletorFechar = 'button[aria-label="Fechar"], button[aria-label="Fechar tour"]'

    if ($body.find(seletorFechar).filter(':visible').length > 0) {
      cy.get(seletorFechar)
        .filter(':visible')
        .first()
        .should('be.visible')
        .click({ force: true })
    }
  })

  cy.get('body').then(($body) => {
    if ($body.attr('data-scroll-locked') === '1') {
      cy.wrap($body).type('{esc}', { force: true })
    }
  })
})

