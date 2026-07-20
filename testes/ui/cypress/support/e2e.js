import '@shelex/cypress-allure-plugin'
import 'cypress-cloud/support'
import 'cypress-xpath'

import './commands_ui/commands_globais'
import './commands_ui/commands_login'
import './commands_ui/commands_modal'
import './commands_ui/commands_sidebar'
import './commands_ui/commands_dashboard'
import './commands_ui/commands_analytics'
import './commands_ui/perfil_commands'

// PostgreSQL
const postgreSQL = require('cypress-postgresql')
postgreSQL.loadDBCommands()