# language: pt
Funcionalidade: Monitoramento - SME AutoServiço

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido


  Cenário: Acessar o dashboard com sucesso
    Então devo ter acesso ao dashboard