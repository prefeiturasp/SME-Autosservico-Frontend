# language: pt
Funcionalidade: Banco de dados - SME AutoServiço

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Exibir card de banco de dados no dashboard
    Então o card de banco de dados deve estar visível

  Cenário: Exibir status do banco ao selecionar sistema com MySQL
    Quando clico no menu lateral "ASCOM"
    E seleciono o sistema "Portal Educação" no select
    Então devo ver o título "Banco de dados principal" no card de banco de dados
    E devo ver o badge de status no card de banco de dados

  Cenário: Exibir duas instâncias ao selecionar sistema com escrita e leitura
    Quando clico no menu lateral "COTIC"
    E seleciono o sistema "Novo SGP" no select
    Então devo ver 2 badges de status no card de banco de dados

  Cenário: Exibir mensagem para sistema sem banco de dados
    Quando clico no menu lateral "COTIC"
    E seleciono o sistema "Escolhas" no select
    Então devo ver a mensagem "Sem banco de dados" no card
