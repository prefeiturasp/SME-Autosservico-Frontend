# language: pt

Funcionalidade: Dashboard - Aba Analytics

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Selecionar aba Analytics
    Dado que estou no dashboard
    Quando clico na aba "Analytics"
    Então a aba "Analytics" deve estar selecionada

@ignore
  Cenário: Validar cards principais
    Dado que estou na aba Analytics
    Então devo visualizar o card "Usuários ativos"
    E devo visualizar o card "Média de sessão"

  Cenário: Validar valores dos cards
    Dado que estou na aba Analytics
    Então o card "Usuários ativos" deve possuir valor
    E o card "Média de sessão" deve possuir valor

  Cenário: Validar tabela Usuários por página
    Dado que estou na aba Analytics
    Então devo visualizar o card "Usuários por página"
    E devo visualizar as colunas "Descrição", "Acesso", "Agora", "Média"
    E devo visualizar pelo menos uma linha na tabela

  Cenário: Validar ordenação da tabela
    Dado que estou na aba Analytics
    Quando clico para ordenar por "Descrição"
    Então a ordenação deve ser aplicada

  Cenário: Validar filtro de páginas
    Dado que estou na aba Analytics
    Quando clico no filtro de páginas
    Então devo visualizar a opção "Todas as páginas"

  Cenário: Validar card Tipo de dispositivo
    Dado que estou na aba Analytics
    Então devo visualizar o card "Tipo de dispositivo"
    E devo visualizar os tipos "Desktop", "Mobile" e "Tablet"

@ignore
  Cenário: Validar alerta de responsividade
    Dado que estou na aba Analytics
    Então devo visualizar o alerta de responsividade

  Cenário: Validar horários de pico
    Dado que estou na aba Analytics
    Então devo visualizar o card "Horários de pico"
    E devo visualizar o texto "Pico:"