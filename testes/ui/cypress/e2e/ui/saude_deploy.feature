# language: pt

Funcionalidade: Dashboard - Aba Saúde do deploy

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Selecionar aba Saúde do deploy
    Dado que estou no dashboard
    Quando clico na aba "Saúde do deploy"
    Então a aba "Saúde do deploy" deve estar selecionada

  Cenário: Alternar entre abas Saúde do deploy e Operacional
    Dado que estou no dashboard
    Quando clico na aba "Saúde do deploy"
    Então a aba "Saúde do deploy" deve estar selecionada
    Quando clico na aba "Operacional"
    Então a aba "Operacional" deve estar selecionada

  Cenário: Validar ambiente Produção - Master
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "Produção - Master"

  Cenário: Validar seletor de ambientes
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o ambiente "Produção"
    E devo visualizar o ambiente "Homologação"
    E devo visualizar o ambiente "QA"

  Cenário: Validar card Jenkins - Branches e Builds
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o card "Jenkins - Branches e Builds"
    E devo visualizar o status "Sucesso"
    E devo visualizar o texto "Estabilidade"
    E devo visualizar o texto "Último sucesso"
    E devo visualizar o texto "Última falha"
    E devo visualizar o texto "Build atual"
    E devo visualizar o texto "Iniciado em"

  Cenário: Validar valor da estabilidade
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o valor de estabilidade

  Cenário: Validar card SonarQube - Indicadores de qualidade
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o card "SonarQube - Indicadores de qualidade"
    E devo visualizar o texto "Avaliação de qualidade"

  Cenário: Validar status da avaliação de qualidade
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o status da avaliação "Reprovado"

  Cenário: Validar informações da branch
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "Última análise:"
    E devo visualizar o texto "Branch: master"

  Cenário: Validar indicadores de qualidade
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o indicador "Bugs"
    E devo visualizar o indicador "Cobertura de testes"
    E devo visualizar o indicador "Código duplicado"
    E devo visualizar o indicador "Vulnerabilidades"
    E devo visualizar o indicador "Code Smells"
    E devo visualizar o indicador "Pontos de atenção em segurança"

  Cenário: Validar valores dos indicadores
    Dado que estou na aba Saúde do deploy
    Então o indicador "Bugs" deve possuir valor
    E o indicador "Cobertura de testes" deve possuir valor
    E o indicador "Código duplicado" deve possuir valor
    E o indicador "Vulnerabilidades" deve possuir valor
    E o indicador "Code Smells" deve possuir valor
    E o indicador "Pontos de atenção em segurança" deve possuir valor

  Cenário: Validar nota dos indicadores
    Dado que estou na aba Saúde do deploy
    Então devo visualizar a nota "E"
    E devo visualizar a nota "A"
    E devo visualizar a nota "C"

  Cenário: Validar quantidade de falhas
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "critérios com falhas"

  Cenário: Validar métricas de cobertura
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "Mínimo: 80%"

  Cenário: Validar métricas de código duplicado
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "Máximo: 5%"

  Cenário: Validar métricas de vulnerabilidades
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "problemas encontrados"

  Cenário: Validar métricas de segurança
    Dado que estou na aba Saúde do deploy
    Então devo visualizar o texto "Trechos que requerem revisão"
