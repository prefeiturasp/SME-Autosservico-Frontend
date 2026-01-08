import "server-only";
import axios from "axios";
import type { BacklogResponse } from "@/types/backlog";

export const azureDevOpsApi = axios.create({
  baseURL: process.env.AZURE_DEVOPS_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getBacklog(
  projectName: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<BacklogResponse> {
  const response = await azureDevOpsApi.get<BacklogResponse>("/backlog", {
    params: {
      project_name: projectName,
      pat: process.env.AZURE_DEVOPS_PAT,
      ...params,
    },
  });

  if (!response.data) {
    throw new Error("Resposta vazia do serviço de backlog");
  }

  return response.data;
}

