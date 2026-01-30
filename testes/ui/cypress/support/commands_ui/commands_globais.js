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
    const seletorFechar = 'button[aria-label="Fechar"]'

    if ($body.find(seletorFechar).length > 0) {
      cy.get(seletorFechar)
        .should('be.visible')
        .click({ force: true })
    }
  })
})

