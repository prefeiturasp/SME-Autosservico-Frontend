class Login_Auto_Servico_Localizadores {

  campo_usuario() {
    return 'input[placeholder="Digite o seu RF..."]'
  }

  campo_senha() {
    return 'input[placeholder="Digite a sua senha..."]'
  }

  botao_acessar() {
    return 'button:contains("Entrar")'
  }

  mensagem_erro() {
    return 'div:contains("Vamos tentar de novo?")'
  }
}

export default Login_Auto_Servico_Localizadores
