# language: pt
Funcionalidade: Login

  Contexto:
    Dado que eu acesso o sistema

  Esquema do Cenário: Acesso ao sistema - <cenario>
    Quando eu informo o RF do tipo "<tipo_rf>" e a senha do tipo "<tipo_senha>"
    E clico no botão de acessar
    Então o resultado esperado para o cenário "<cenario>" deve ser exibido

    Exemplos:
      | cenario             | tipo_rf      | tipo_senha      |
      | Login válido padrão | rf_valido    | senha_valida    |
      | Login inválido      | rf_invalido  | senha_invalida  |
