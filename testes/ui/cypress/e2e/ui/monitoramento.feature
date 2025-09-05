# language: pt

Funcionalidade: Acessar painel de monitoramento dos sistemas
 Cenário: Acessar o dashboard com sucesso
    Dado que eu estou na página de login
    Quando eu insiro o RF "6605656" e senha "Sgp5656"
    E clico no botão de Entrar
    Então devo ter acesso ao dashboard

 Cenário: Consultar sistema se houver falha
    Dado que eu estou na página de login
    Quando eu insiro o RF "6605656" e senha "Sgp5656"
    E clico no botão de Entrar
    Então devo ter acesso ao dashboard
    E clico no menu COTIC
    E seleciono o sistema Autosserviço
    Então devo ver se há algum incidente no sistema
