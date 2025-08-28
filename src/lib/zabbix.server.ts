
// src/lib/zabbix.server.ts
import "server-only";
import axios from "axios";

const baseURL = process.env.ZABBIX_API_URL;
const token = process.env.ZABBIX_API_TOKEN;

if (!baseURL) {
  throw new Error("[Zabbix] ZABBIX_API_URL ausente no .env");
}
if (!token) {
  throw new Error("[Zabbix] ZABBIX_API_TOKEN ausente no .env");
}

export const zabbixApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json-rpc",
    Authorization: `Bearer ${token}`,
  },
});

export async function zabbixRpc<T>(method: string, params: unknown, id = 1): Promise<T> {
  const { data } = await zabbixApi.post("", { jsonrpc: "2.0", method, params, id });

  if (typeof data === "string") throw new Error("Resposta não-JSON do Zabbix");
  if (data?.error) {
    let errorMsg = "Zabbix " + data.error.code + ": " + data.error.message;
    if (data.error.data) {
      errorMsg += " - " + data.error.data;
    }
    throw new Error(errorMsg);
  }
  return data.result as T;
}
