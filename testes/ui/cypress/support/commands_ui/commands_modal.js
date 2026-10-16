Cypress.Commands.add('fecharOverlaySeExistir', () => {
  cy.get('body').then($body => {
    const overlay = 'div[data-state="open"]'

    if ($body.find(overlay).length > 0) {
      cy.log('Overlay detectado – clicando fora para fechar')

      cy.get(overlay)
        .first()
        .click({ force: true })

      cy.get(overlay, { timeout: 10000 }).should('not.exist')
    }
  })
})
