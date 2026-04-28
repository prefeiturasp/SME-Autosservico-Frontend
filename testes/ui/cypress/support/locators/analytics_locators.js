class Analytics_Locators {

  // ABAS
  abaAnalytics = '[role="tab"]:contains("Analytics")'
  abaOperacional = '[role="tab"]:contains("Operacional")'

  // CARDS
  usuariosAtivos = 'div:contains("Usuários ativos")'
  mediaSessao = 'div:contains("Média de sessão")'

  // TABELA
  usuariosPorPagina = 'div:contains("Usuários por página")'

  // DISPOSITIVOS
  tipoDispositivo = 'div:contains("Tipo de dispositivo")'

  // ALERTA
  alerta = '[role="alert"]'

  // HORÁRIOS
  horariosPico = 'div:contains("Horários de pico")'
  picoTexto = 'span:contains("Pico:")'
}

export default Analytics_Locators