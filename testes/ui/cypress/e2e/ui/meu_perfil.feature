# language: pt

Funcionalidade: Meu Perfil

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Acessar tela Meu Perfil
    Dado que já estou no dashboard após o login
    Quando clico no item "Perfil" do menu superior
    Então devo visualizar a tela "Meu perfil"

  Cenário: Validar título da página
    Dado que estou na tela Meu Perfil
    Então devo visualizar o título "Meu perfil"

  Cenário: Validar card principal do usuário
    Dado que estou na tela Meu Perfil
    Então devo visualizar o nome do usuário
    E devo visualizar o status "Conta ativa"

  Cenário: Validar informações do card principal
    Dado que estou na tela Meu Perfil
    Então devo visualizar o campo "Último acesso"
    E devo visualizar o campo "Tempo de sessão"

  Cenário: Validar card Dados pessoais
    Dado que estou na tela Meu Perfil
    Então devo visualizar o card de perfil "Dados pessoais"

  Cenário: Validar campos dos dados pessoais
    Dado que estou na tela Meu Perfil
    Então devo visualizar o campo "Nome completo"
    E devo visualizar o campo "CPF"
    E devo visualizar o campo "E-mail"
    E devo visualizar o campo "Cargo"
    E devo visualizar o campo "Coordenadoria"

  Cenário: Validar CPF mascarado
    Dado que estou na tela Meu Perfil
    Então o CPF deve estar mascarado

  Cenário: Validar preenchimento dos dados
    Dado que estou na tela Meu Perfil
    Então o campo "Nome completo" deve possuir valor
    E o campo "CPF" deve possuir valor
    E o campo "E-mail" deve possuir valor

  Cenário: Validar card Áreas de acesso
    Dado que estou na tela Meu Perfil
    Então devo visualizar o card de perfil "Áreas de acesso"

  Cenário: Validar lista de áreas
    Dado que estou na tela Meu Perfil
    Então devo visualizar a área "ASCOM"
    E devo visualizar a área "CODAE"
    E devo visualizar a área "COGEP"
    E devo visualizar a área "COPED"
    E devo visualizar a área "COPLAN"
    E devo visualizar a área "COTIC"
    E devo visualizar a área "GIPE"

  Cenário: Validar permissões Operacional
    Dado que estou na tela Meu Perfil
    Então devo visualizar a permissão "Operacional"

  Cenário: Validar permissões Analytics
    Dado que estou na tela Meu Perfil
    Então devo visualizar a permissão "Analytics"

  Cenário: Validar permissões Saúde do deploy
    Dado que estou na tela Meu Perfil
    Então devo visualizar a permissão "Saúde do deploy"

  Cenário: Validar existência de áreas cadastradas
    Dado que estou na tela Meu Perfil
    Então deve existir pelo menos uma área cadastrada

  Cenário: Validar botão Encerrar sessão
    Dado que estou na tela Meu Perfil
    Então devo visualizar o botão "Encerrar sessão"

  Cenário: Validar logout
    Dado que estou na tela Meu Perfil
    Quando clico no botão "Encerrar sessão"
    Então devo ser redirecionado para a tela de login