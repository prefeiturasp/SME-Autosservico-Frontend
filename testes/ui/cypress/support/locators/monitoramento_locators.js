class Monitoramento_Auto_Servico_Localizadores {


    botao_ascom() {
        return 'span[data-testid="sidebar-button-ascom"]';
    }

    botao_sistema() {
        return '/html/body/div/main/div[2]/div/div/div/button';
    }

    opcao_sistema() {
        return 'span[data-slot="select-value"]';
    }

    status_sistema() {
        return '/html/body/div[1]/main/div[3]/div/div[1]/div[2]/div/div/div[3]';
    }
}

export default Monitoramento_Auto_Servico_Localizadores;