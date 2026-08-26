# language: pt

Funcionalidade: Dashboard - Métricas do sistema

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Exibir a aba Métricas
    Dado que estou no dashboard
    Quando acesso a aba "Métricas" do dashboard
    Então a aba "Métricas" deve estar ativa

  Cenário: Exibir seletor de sistema
    Dado que estou na aba Métricas
    Então devo visualizar o seletor "Sistema"
    E devo visualizar a instrução "Selecione um sistema para visualizar as informações"

  Cenário: Exibir os indicadores de acesso
    Dado que estou na aba Métricas
    Então devo visualizar os indicadores de acesso
    E cada indicador de acesso deve exibir um valor numérico

  Cenário: Exibir o resumo de sorteios
    Dado que estou na aba Métricas
    Então devo visualizar a seção "Sorteios"
    E devo visualizar o resumo de status de sorteios
    E devo visualizar a tabela "Resultados de sorteios por tipo"
    E devo visualizar a tabela "Resultados de sorteios por ganhador"
    E devo visualizar a tabela "Inscrições em sorteios por DRE"

  Cenário: Alternar o período dos resultados de sorteios
    Dado que estou na aba Métricas
    Quando seleciono o período "Quinzena" na seção "Sorteios"
    Então o período "Quinzena" deve estar disponível na seção "Sorteios"

  Cenário: Expandir a lista de DREs de sorteios
    Dado que estou na aba Métricas
    Quando solicito mais DREs na tabela "Inscrições em sorteios por DRE"
    Então a tabela "Inscrições em sorteios por DRE" deve conter ao menos uma linha

  Cenário: Exibir o resumo de ordem de inscrição
    Dado que estou na aba Métricas
    Então devo visualizar a seção "Ordem de inscrição"
    E devo visualizar o resumo de status de ordens de inscrição
    E devo visualizar a tabela "Resultados de ordens de inscrição por tipo"
    E devo visualizar a tabela "Resultados de ordens de inscrição por ganhador"
    E devo visualizar a tabela "Inscrições em ordens de inscrição por DRE"

  Cenário: Exibir o filtro de mês das ordens de inscrição
    Dado que estou na aba Métricas
    Então devo visualizar o filtro de mês na tabela "Inscrições em ordens de inscrição por DRE"

  Cenário: Exibir indicadores de oportunidades e recrutamento
    Dado que estou na aba Métricas
    Então devo visualizar a seção "Oportunidades e recrutamento"
    E devo visualizar os indicadores de oportunidades e recrutamento
