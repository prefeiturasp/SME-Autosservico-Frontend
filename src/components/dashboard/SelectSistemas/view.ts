import { useCallback } from "react";
import { SelectedSistemaSchema } from "./schema"; // Importando o schema Zod

export default function useView() {
    const handleSelectChange = useCallback((id: string) => {

        // Validação com Zod
        const validation = SelectedSistemaSchema.safeParse(id);

        if (!validation.success) {
            console.error("Erro de validação:", validation.error.errors[0].message);
            // Aqui você pode adicionar tratamento de erro (ex: exibir na UI)
        } else {
            console.log("Valor válido:", validation.data);
            // Aqui você pode adicionar lógica adicional para valor válido
        }
    }, []); // ✅ Memoriza a função, evitando recriação a cada render

    return { handleSelectChange };
}
