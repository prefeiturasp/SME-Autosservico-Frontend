const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const { cloudPlugin } = require('cypress-cloud/plugin')
const dotenv = require('dotenv')
const cucumber = require('cypress-cucumber-preprocessor').default

dotenv.config()

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
}

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: true,
    baseUrl: 'https://qa-autosservico.sme.prefeitura.sp.gov.br/',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,
    specPattern: 'cypress/e2e/**/*.{feature,cy.js}',
    defaultCommandTimeout: 60000,

    async setupNodeEvents(on, config) {
      // =====================
      // Allure
      // =====================
      allureWriter(on, config)

      // =====================
      // Cucumber
      // =====================
      on('file:preprocessor', cucumber())

      // =====================
      // Cypress Cloud
      // =====================
      const enhancedConfig = await cloudPlugin(on, config)

      // =====================
      // ENV (LOGIN)
      // =====================
      enhancedConfig.env.RF_VALIDO = process.env.CYPRESS_RF_VALIDO
      enhancedConfig.env.SENHA_VALIDA = process.env.CYPRESS_SENHA_VALIDA
      enhancedConfig.env.RF_INVALIDO = process.env.CYPRESS_RF_INVALIDO
      enhancedConfig.env.SENHA_INVALIDA = process.env.CYPRESS_SENHA_INVALIDA

      // =====================
      // ENV (DB)
      // =====================
      enhancedConfig.env.db = dbConfig

      return enhancedConfig
    }
  }
})
