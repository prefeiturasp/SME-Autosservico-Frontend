# language: pt
Funcionalidade: Monitoramento - SME AutoServiço

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

@ignore
  Cenário: Acessar o dashboard com sucesso
    Então devo ter acesso ao dashboard
    
@ignore
  Cenário: Consultar sistema com possível incidente
    Quando clico no menu "ASCOM"
    E seleciono o sistema "Portal Educação"
    Então devo ver se há algum incidente no sistema