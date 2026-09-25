# language: pt
Funcionalidade: Dashboard

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Validar card de lançamentos
    Então o card de "Lançamentos" deve estar visível
    E deve exibir a versão e data de realização

  Cenário: Validar disponibilidade do ambiente
    Então o card de "Disponibilidade do ambiente" deve estar visível
    E o status do ambiente deve ser "Disponível"

  Cenário: Validar saúde do servidor
    Então o card de "Saúde do servidor" deve estar visível
    E deve exibir os serviços "Fila" e "API Service"

  Cenário: Validar banco de dados
    Então o card de "Banco de dados" deve estar visível
    E o banco deve estar com status "Disponível"

  Cenário: Validar listagem de bugs
    Então o card de "Bugs" deve estar visível
    E a tabela de bugs deve conter registros

  Cenário: Validar card de usuários com acesso
    Então o card de "Usuários com acesso" deve estar visível

  Cenário: Validar colunas da tabela de bugs
    Então o card de "Bugs" deve estar visível
    E a tabela de bugs deve exibir as colunas "Código", "Título", "Status" e "Classificação"

  Cenário: Validar indicadores de contagem de bugs
    Então o card de "Bugs" deve estar visível
    E devo visualizar os indicadores "Bugs do Ciclo", "Abertos", "Em andamento", "Resolvidos" e "Tempo médio de atendimento"
