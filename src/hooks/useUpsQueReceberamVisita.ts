import { useQuery } from "@tanstack/react-query";

type Options = {
  systemName: string;
};

const MOCK_ITEMS: string[] = [
  "Sítio Boa Esperança",
  "Horta Comunitária Jardim das Rosas",
  "Fazenda Escola Vale Verde",
  "Sítio Recanto Agroecológico",
  "Horta Comunitária Parque Novo Mundo",
  "Chácara Sementes do Amanhã",
  "Horta Escolar Vila Nova",
  "Sítio Raízes da Terra",
  "Fazenda Agroecológica Boa Vista",
  "Horta Comunitária Jardim Celeste",
  "Sítio Flor da Mata",
];

export function useUpsQueReceberamVisita({ systemName }: Options) {
  return useQuery<string[]>({
    queryKey: ["ups-que-receberam-visita", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ITEMS;
    },
  });
}
