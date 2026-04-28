export const DASHBOARD = {

  LANCAMENTOS: {
    ROOT: '#onboarding-lancamentos',
    TITULO: 'span:contains("Lançamentos")',
    VERSAO: 'div.font-bold',
    DATA: 'div.text-[12px]'
  },

  DISPONIBILIDADE: {
    ROOT: '#onboarding-disponibilidade',
    TITULO: 'div:contains("Disponibilidade do ambiente")',
    STATUS: '[aria-label="Status: Disponível"]'
  },

  SAUDE_SERVIDOR: {
    ROOT: '#onboarding-saude-servidor',
    TITULO: 'div:contains("Saúde do servidor")',
    FILA: 'div:contains("Fila")',
    API: 'div:contains("API Service")'
  },

  BANCO_DADOS: {
    ROOT: '#onboarding-banco-dados',
    TITULO: 'div:contains("Banco de dados")',
    STATUS: '[aria-label="Status: Disponível"]'
  },

  BUGS: {
    ROOT: '#onboarding-bugs',
    TABELA: 'table',
    LINHAS: 'tbody tr'
  }
}