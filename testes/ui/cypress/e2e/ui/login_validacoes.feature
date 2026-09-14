# language: pt

Funcionalidade: Validações do formulário de login

  Cenário: Exibir os elementos essenciais do formulário
    Dado que eu acesso o sistema
    Então devo visualizar o formulário de login
    E o botão de entrar deve estar desabilitado

  Cenário: Limitar o Registro Funcional a oito dígitos
    Dado que eu acesso o sistema
    Quando informo o RF "123456789" no formulário de login
    Então o campo de RF deve conter "12345678"

  Cenário: Alternar a visibilidade da senha sem alterar seu valor
    Dado que eu acesso o sistema
    Quando informo a senha "senha-de-teste" no formulário de login
    E alterno a visibilidade da senha
    Então o campo de senha deve estar visível e conter "senha-de-teste"
    Quando alterno a visibilidade da senha
    Então o campo de senha deve estar oculto e conter "senha-de-teste"

  Cenário: Limpar a senha após credenciais inválidas
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_invalido" e a senha do tipo "senha_invalida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login inválido" deve ser exibido
    E o campo de senha deve estar vazio
