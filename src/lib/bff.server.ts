// src/lib/bff.server.ts
import "server-only";
import axios from "axios";

/**
 * Cliente HTTP do BFF do Autosserviço (uso server-side apenas).
 *
 * O BFF orquestra e cacheia as métricas servidas pelo Backend (SIGPAE etc.).
 * A URL e a chave vêm de AUTOSSERVICO_BFF_URL / AUTOSSERVICO_BFF_API_KEY — a
 * chave nunca é exposta ao browser (não usar NEXT_PUBLIC_).
 */
export const bffApi = axios.create({
  baseURL: process.env.AUTOSSERVICO_BFF_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.AUTOSSERVICO_BFF_API_KEY ?? "",
  },
});

/** GET autenticado no BFF, devolvendo o corpo JSON já tipado. */
export async function bffGet<T>(path: string): Promise<T> {
  const { data } = await bffApi.get<T>(path);
  return data as T;
}
