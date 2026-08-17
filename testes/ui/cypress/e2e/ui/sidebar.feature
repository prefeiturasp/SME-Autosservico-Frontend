# language: pt
Funcionalidade: Sidebar - SME AutoServiço

  Contexto:
    Dado que eu acesso o sistema
    Quando eu informo o RF do tipo "rf_valido" e a senha do tipo "senha_valida"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "Login válido padrão" deve ser exibido

  Cenário: Exibir sidebar e logo após login
    Então o sidebar deve estar visível
    E o logo do AutoServiço deve estar visível

@ignore
  Cenário: Exibir todos os itens do menu do sidebar
    Então devo visualizar todos os itens do menu do sidebar

  Cenário: Fechar o sidebar
    Quando eu clico no botão de fechar do sidebar
    Então o sidebar não deve estar visível

  Cenário: Ativar item COPLAN no sidebar
    Quando clico no item "COPLAN" do sidebar
    Então o item "COPLAN" deve estar ativo no sidebar

  Cenário: Ativar item COTIC no sidebar
    Quando clico no item "COTIC" do sidebar
    Então o item "COTIC" deve estar ativo no sidebar

  Cenário: Ativar item ASCOM no sidebar
    Quando clico no item "ASCOM" do sidebar
    Então o item "ASCOM" deve estar ativo no sidebar