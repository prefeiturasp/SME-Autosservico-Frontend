import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchDatabaseStatus } from "@/actions/_helpers/databaseStatus";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const system = (searchParams.get("system") ?? "").trim();

  if (!system) return NextResponse.json({ error: "system é obrigatório" }, { status: 400 });

  try {
    const status = await fetchDatabaseStatus(system);
    return NextResponse.json(status);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar status do banco de dados";
    return NextResponse.json({ error: errorMessage ?? "Erro ao consultar status do banco de dados" }, { status: 500 });
  }
}
