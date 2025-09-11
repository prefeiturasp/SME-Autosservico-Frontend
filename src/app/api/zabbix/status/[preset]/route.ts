import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { zabbixRpc } from "@/lib/zabbix.server";
import { zabbixStatusFromTriggers, type Trigger } from "@/actions/_helpers/zabbixStatus";

export const runtime = "nodejs";
export const revalidate = 0;

const DEFAULT_HOST = process.env.ZABBIX_DEFAULT_HOST ?? "Zabbix server";

/** Quais presets suportamos e como montar os params de trigger.get */
const buildParamsByPreset = {
  // era: getDisponibilidadeDosAmbientesProducao
  producao: (project: string, host: string) => ({
    method: "trigger.get" as const,
    params: {
      filter: { host: [host], description: [project] },
      output: "extend" as const,
    },
    apiVersion: 2 as const, // equivalente ao seu terceiro argumento do zabbixRpc
  }),

  // era: getSaudeDosServidoresFilas
  filas: (project: string, host: string) => ({
    method: "trigger.get" as const,
    params: {
      host,
      output: "extend" as const,
      selectFunctions: "extend",
      filter: { description: project },
    },
    apiVersion: 1 as const,
  }),
} as const;

type Preset = keyof typeof buildParamsByPreset;

export async function GET(req: NextRequest, { params }: { params: { preset: string } }) {
  // 1) Auth
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) Query params
  const { searchParams } = new URL(req.url);
  const project = (searchParams.get("project") ?? "").trim();
  const host = (searchParams.get("host") ?? DEFAULT_HOST).trim();
  const preset = (params.preset ?? "").toLowerCase() as Preset;

  if (!project) return NextResponse.json({ error: "project é obrigatório" }, { status: 400 });
  if (!(preset in buildParamsByPreset)) {
    return NextResponse.json({ error: "preset inválido" }, { status: 400 });
  }

  // 3) Monta chamada ao Zabbix conforme o preset
  try {
    const cfg = buildParamsByPreset[preset](project, host);
    const triggers = await zabbixRpc<Trigger[]>(cfg.method, cfg.params, cfg.apiVersion);
    const status = zabbixStatusFromTriggers(triggers);
    return NextResponse.json(status);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar Zabbix";
    return NextResponse.json({ error: errorMessage ?? "Erro ao consultar Zabbix" }, { status: 500 });
  }
}
