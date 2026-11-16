import type { ControleAcessosSgpResponse } from "@/types/sgpControleAcessos";

export type TomControleAcessos = "success" | "warning" | "danger" | "muted";

export type IndicadorControleAcessos = {
    valor: string;
    detalhe?: string;
    tom: TomControleAcessos;
    badge: string;
    tomBadge: TomControleAcessos;
};

export type ResumoControleAcessos = {
    limite: IndicadorControleAcessos;
    conectados: IndicadorControleAcessos;
    fila: IndicadorControleAcessos;
    tempoEspera: IndicadorControleAcessos;
};

export const PERCENTUAL_ALERTA_FILA = 90;

const FUSO = "America/Sao_Paulo";
const numero = new Intl.NumberFormat("pt-BR");
const percentual = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const hora = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: FUSO,
});
const data = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: FUSO,
});

export function formatarDuracao(segundos: number): string {
    if (segundos < 1) return `${Math.round(segundos * 1000)} ms`;
    const total = Math.round(segundos);
    if (total < 60) return `${total} s`;
    const minutos = Math.floor(total / 60);
    const resto = total % 60;
    return resto ? `${minutos} min ${resto} s` : `${minutos} min`;
}

export function formatarInicioFila(iso: string): string {
    const momento = new Date(iso);
    return `${hora.format(momento)} - ${data.format(momento)}`;
}

export function resumirControleAcessos(
    estado: ControleAcessosSgpResponse,
): ResumoControleAcessos | undefined {
    const { limiteConexoes, conectados, emFila } = estado;
    if (limiteConexoes === null || conectados === null || emFila === null) {
        return undefined;
    }

    const uso = limiteConexoes > 0 ? (conectados / limiteConexoes) * 100 : 0;
    const restantes = Math.max(limiteConexoes - conectados, 0);
    const restantesPct =
        limiteConexoes > 0
            ? percentual.format(restantes / limiteConexoes)
            : "0%";
    let tom: TomControleAcessos = "success";
    if (emFila > 0 || conectados >= limiteConexoes) tom = "danger";
    else if (uso >= PERCENTUAL_ALERTA_FILA) tom = "warning";

    const textoLimite: Record<TomControleAcessos, string> = {
        success: `${restantesPct} de conexões disponíveis`,
        warning: `${restantesPct} para o acionamento da fila`,
        danger: "Fila de acessos ativa",
        muted: "",
    };

    const tempo = estado.tempoEspera;
    const comEspera =
        tempo?.mediaSegundos != null && tempo.posicaoMedia != null;

    let badgeFila = "Sem acionamento de fila";
    if (emFila > 0) {
        badgeFila = estado.filaIniciadaEm
            ? `Fila iniciou: ${formatarInicioFila(estado.filaIniciadaEm)}`
            : "Fila de acessos ativa";
    }

    return {
        limite: {
            valor: numero.format(limiteConexoes),
            tom: "muted",
            badge: textoLimite[tom],
            tomBadge: tom,
        },
        conectados: {
            valor: numero.format(conectados),
            detalhe: `(${percentual.format(uso / 100)})`,
            tom,
            badge: restantes
                ? `Restam ${numero.format(restantes)} conexões`
                : "Não restam conexões",
            tomBadge: tom === "success" ? "muted" : tom,
        },
        fila: {
            valor: numero.format(emFila),
            tom: emFila > 0 ? "danger" : "muted",
            badge: badgeFila,
            tomBadge: emFila > 0 ? "danger" : "muted",
        },
        tempoEspera: comEspera
            ? {
                  valor: formatarDuracao(tempo.mediaSegundos ?? 0),
                  tom: "danger",
                  badge: `Posição média até o acesso: ${tempo.posicaoMedia}º`,
                  tomBadge: "danger",
              }
            : {
                  valor: "0 ms",
                  tom: "muted",
                  badge: "Sem acionamento de fila",
                  tomBadge: "muted",
              },
    };
}
