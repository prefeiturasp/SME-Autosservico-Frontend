import type { ProfileBreakdownBlock } from "@/types/metricas";
import { useQuery } from "@tanstack/react-query";

type Options = {
    systemName: string;
};

const MOCK_BLOCKS: ProfileBreakdownBlock[] = [
    {
        title: "Gênero",
        rows: [
            { label: "Feminino", value: 34 },
            { label: "Masculino", value: 27 },
            { label: "Não informado", value: 2 },
        ],
    },
    {
        title: "Faixa etária",
        rows: [
            { label: "Até 30 anos", value: 9 },
            { label: "31 a 45 anos", value: 22 },
            { label: "46 a 60 anos", value: 19 },
            { label: "Acima de 60 anos", value: 13 },
        ],
    },
    {
        title: "Raça",
        rows: [
            { label: "Branca", value: 20 },
            { label: "Preta", value: 24 },
            { label: "Parda", value: 14 },
            { label: "Amarela", value: 3 },
            { label: "Indígena", value: 2 },
        ],
    },
    {
        title: "Nacionalidade",
        rows: [
            { label: "Brasileira", value: 68 },
            { label: "Estrangeira", value: 2 },
        ],
    },
];

export function usePerfilResponsaveisUps({ systemName }: Options) {
    return useQuery<ProfileBreakdownBlock[]>({
        queryKey: ["perfil-responsaveis-ups", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return MOCK_BLOCKS;
        },
    });
}
