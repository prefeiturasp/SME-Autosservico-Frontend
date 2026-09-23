export type DreOption = {
    value: string;
    label: string;
};

export const ALL_DRES_VALUE = "all";

export const DRE_OPTIONS: ReadonlyArray<DreOption> = [
    { value: ALL_DRES_VALUE, label: "Todas as DREs" },
    { value: "butanta", label: "DRE Butantã" },
    { value: "campo-limpo", label: "DRE Campo Limpo" },
    { value: "capela-do-socorro", label: "DRE Capela do Socorro" },
    { value: "freguesia-brasilandia", label: "DRE Freguesia / Brasilândia" },
    { value: "guaianases", label: "DRE Guaianases" },
    { value: "ipiranga", label: "DRE Ipiranga" },
    { value: "itaquera", label: "DRE Itaquera" },
    { value: "jacana-tremembe", label: "DRE Jaçanã/Tremembé" },
    { value: "penha", label: "DRE Penha" },
    { value: "pirituba", label: "DRE Pirituba" },
    { value: "santo-amaro", label: "DRE Santo Amaro" },
    { value: "sao-mateus", label: "DRE São Mateus" },
    { value: "sao-miguel", label: "DRE São Miguel" },
];
