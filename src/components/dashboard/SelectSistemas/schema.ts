// src/components/dashboard/SelectSistemas/schema.ts
import { z } from "zod";

export const SistemaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  zabbixQueryFrontend: z.string(),
  zabbixQueryBackend: z.string(),
});

export type Sistema = z.infer<typeof SistemaSchema>;

// Schema para validar o valor selecionado
export const SelectedSistemaSchema = z.string()
  .nonempty("Selecione um sistema válido")
  .refine(value => value !== "invalid", {
    message: "Opção inválida selecionada"
  });

export type SelectedSistema = z.infer<typeof SelectedSistemaSchema>;
