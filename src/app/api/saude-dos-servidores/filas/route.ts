import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // seu NextAuth já exporta auth()
import { getSaudeDosServidoresFilas } from "@/actions/saude-dos-servidores";

export const runtime = "nodejs";      // garante Node runtime (axios)
export const revalidate = 0;          // sem cache estático

export async function GET(req: NextRequest) {
  // 1) Protege com NextAuth
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) Lê parâmetros
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") ?? "";
  const host = searchParams.get("host") ?? undefined;
  if (!project) return NextResponse.json({ error: "project é obrigatório" }, { status: 400 });

  // 3) Chama a action (server-only)
  try {
    const status = await getSaudeDosServidoresFilas(project, host);

    return NextResponse.json(status);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar Zabbix";
    return NextResponse.json({ error: errorMessage ?? "Erro ao consultar Zabbix" }, { status: 500 });
  }
}
