export type UeOption = {
    value: string;
    label: string;
};

export const ALL_UES_VALUE = "all";

export const UE_OPTIONS: ReadonlyArray<UeOption> = [
    { value: ALL_UES_VALUE, label: "Todas as UEs" },
    { value: "cei-parc-pau-brasil", label: "CEI PARC. PAU BRASIL" },
    { value: "cei-parc-jd-arpoador", label: "CEI PARC. JD. ARPOADOR" },
    { value: "cemei-morumbi", label: "CEMEI MORUMBI" },
    { value: "cemei-irapara", label: "CEMEI IRAPARÁ" },
    {
        value: "emef-adalgiza-segurado-da-silveira-profa",
        label: "EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA",
    },
    { value: "emei-jardim-celeste", label: "EMEI JARDIM CELESTE" },
    { value: "emef-vila-nova", label: "EMEF VILA NOVA" },
];
