import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Auto_Servico_Localizadores from '../locators/login_locators'

const locators = new Login_Auto_Servico_Localizadores()

Given('que eu acesso o sistema', () => {
    cy.login_autoservico()
})

When('eu insiro o RF {string} e senha {string}', (rf, senha) => {
    if (rf) {
        cy.get(locators.campo_usuario()).clear().type(rf)
    } else {
        cy.get(locators.campo_usuario()).clear()
    }

    if (senha) {
        cy.get(locators.campo_senha()).clear().type(senha)
    } else {
        cy.get(locators.campo_senha()).clear()
    }
})

When('clico no botão de acessar', () => {
    cy.get(locators.campo_usuario()).invoke('val').then(rfVal => {
        cy.get(locators.campo_senha()).invoke('val').then(senhaVal => {
            if (!rfVal) {
                // RF vazio: digita um caractere e apaga para disparar a validação
                cy.get(locators.campo_usuario())
                  .type('a')
                  .clear()
                cy.get('button')
                  .filter((_, el) => el.innerText.trim() === 'Entrar')
                  .click({ force: true })
            } else if (!senhaVal) {
                // Senha vazia: digita e limpa para disparar validação, depois força clique
                cy.get(locators.campo_senha())
                  .type('a')
                  .clear()
                cy.get('button')
                  .filter((_, el) => el.innerText.trim() === 'Entrar')
                  .click({ force: true })
            } else {
                // Ambos preenchidos: clica normalmente quando habilitado
                cy.get('button')
                  .filter((_, el) => el.innerText.trim() === 'Entrar')
                  .should('not.be.disabled')
                  .click()
            }
        })
    })
})

Then('o resultado esperado para {string} deve ser exibido', (cenario) => {
    if (cenario === 'Login válido padrão') {
        cy.url().should('include', '/dashboard')
    } else if (cenario === 'Login inválido') {
        cy.get(locators.mensagem_erro()).should('be.visible')
    } else if (cenario === 'Senha em branco') {
        cy.get(locators.campo_senha()).should('have.value', '')
        cy.get(locators.mensagem_erro_senha_vazia()).should('be.visible')
    } else if (cenario === 'RF em branco') {
        cy.get(locators.campo_usuario()).should('have.value', '')
        cy.get(locators.mensagem_erro_rf_vazio()).should('be.visible')
    } else {
        throw new Error(`Cenário não tratado: ${cenario}`)
    }
})
