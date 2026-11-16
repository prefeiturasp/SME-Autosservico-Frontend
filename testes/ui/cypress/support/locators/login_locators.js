class Login_Auto_Servico_Localizadores {

  campo_usuario() {
    return 'input[placeholder*="RF"], input[name="rf"]'
  }

  campo_senha() {
    return 'input[placeholder*="senha"], input[name="password"]'
  }

  botao_acessar() {
    return 'button[type="submit"], button:contains("Entrar")'
  }

  mensagem_erro() {
    return 'div:contains("Vamos tentar de novo?")'
  }
}

export default Login_Auto_Servico_Localizadores
