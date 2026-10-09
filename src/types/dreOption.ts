export type DreOption = {
    value: string;
    label: string;
};

export const ALL_DRES_VALUE = "all";

// O value é o código EOL da DRE (core_unidade.codigo_eol no PTRF), que vai
// direto para o filtro do BFF.
export const DRE_OPTIONS: ReadonlyArray<DreOption> = [
    { value: ALL_DRES_VALUE, label: "Todas as DREs" },
    { value: "108100", label: "DRE Butantã" },
    { value: "108200", label: "DRE Campo Limpo" },
    { value: "108300", label: "DRE Capela do Socorro" },
    { value: "108400", label: "DRE Freguesia / Brasilândia" },
    { value: "108500", label: "DRE Guaianases" },
    { value: "108600", label: "DRE Ipiranga" },
    { value: "108700", label: "DRE Itaquera" },
    { value: "108800", label: "DRE Jaçanã/Tremembé" },
    { value: "108900", label: "DRE Penha" },
    { value: "109000", label: "DRE Pirituba" },
    { value: "109100", label: "DRE Santo Amaro" },
    { value: "109200", label: "DRE São Mateus" },
    { value: "109300", label: "DRE São Miguel" },
];
