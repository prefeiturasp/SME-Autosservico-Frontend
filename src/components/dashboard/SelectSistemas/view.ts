import { SelectedSistemaSchema } from "./schema"; // Importando o schema Zod

export default function useView() {
    const useHandleSelectChange = (id: string) => {
        console.log("Selected system ID: ", id);

        // Validação com Zod
        const validation = SelectedSistemaSchema.safeParse(id);

        if (!validation.success) {
            console.error("Erro de validação:", validation.error.errors[0].message);
            // Aqui você pode adicionar tratamento de erro (ex: exibir na UI)
        } else {
            console.log("Valor válido:", validation.data);
            // Aqui você pode adicionar lógica adicional para valor válido
        }
    };

    return { useHandleSelectChange };
}
