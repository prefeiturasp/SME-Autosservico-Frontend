class Monitoramento_Auto_Servico_Localizadores {


    botao_cotic() {
        return 'span[data-testid="sidebar-button-cotic"]';
    }

    botao_sistema() {
        return '/html/body/div/main/div[2]/div/div/div/button';
    }

    opcao_sistema() {
        return '/html/body/div/main/div[2]/div/div/div/button/span';
    }

    status_sistema() {
        return '/html/body/div/main/div[3]/div/div[1]/div[2]/div/div/div[3]';
    }
}

export default Monitoramento_Auto_Servico_Localizadores;