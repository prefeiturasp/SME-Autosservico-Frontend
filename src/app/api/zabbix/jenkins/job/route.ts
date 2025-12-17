import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getJenkinsJobSummary } from "@/actions/jenkins-job";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  // Modo padrão: project = chave (fullName) usada no item.get do Zabbix
  const project = (searchParams.get("project") ?? "").trim();

  if (!project) return NextResponse.json({ error: "project é obrigatório" }, { status: 400 });

  try {
    const summary = await getJenkinsJobSummary(project);
    return NextResponse.json(summary);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar Zabbix";
    return NextResponse.json({ error: errorMessage ?? "Erro ao consultar Zabbix" }, { status: 500 });
  }
}
