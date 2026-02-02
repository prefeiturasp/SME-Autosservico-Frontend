import '@shelex/cypress-allure-plugin'
import 'cypress-cloud/support'
import 'cypress-xpath'

import './commands_ui/commands_globais'
import './commands_ui/commands_login'
import './commands_ui/commands_modal'
import './commands_ui/commands_sidebar'

// PostgreSQL
const postgreSQL = require('cypress-postgresql')
postgreSQL.loadDBCommands()

