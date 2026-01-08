import { z } from "zod";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";

export interface Sistema {
  id: string;
  nome: string;
  zabbixQueryFrontend: string;
  zabbixQueryBackend: string;
  zabbixQueryFilasRabbitMQ: string;
  zabbixQueryJenkinsJob: string;
  jenkinsSubprojects?: JenkinsSubproject[];
  azureDevopsProjectName?: string;
}

const JenkinsSubprojectSchema = z.object({
  label: z.string(),
  key: z.string(),
});

export const SistemaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  zabbixQueryFrontend: z.string(),
  zabbixQueryBackend: z.string(),
  zabbixQueryFilasRabbitMQ: z.string(),
  zabbixQueryJenkinsJob: z.string(),
  jenkinsSubprojects: z.array(JenkinsSubprojectSchema).optional(),
  azureDevopsProjectName: z.string().optional(),
});

export const SelectedSistemaSchema = z
  .string()
  .min(1, "Selecione um sistema válido")
  .refine((val) => val !== "invalid", {
    message: "Opção inválida selecionada",
  });
