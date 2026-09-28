import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  fetchUsuariosAcessoAtivo,
  resolverPeriodo,
} from "@/actions/_helpers/sgpMetricas";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { anoLetivo, bimestre } = resolverPeriodo(
      new URL(request.url).searchParams,
    );
    const data = await fetchUsuariosAcessoAtivo(anoLetivo, bimestre);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar usuários com acesso ativo do SGP";
    return NextResponse.json(
      {
        error:
          errorMessage ??
          "Erro ao consultar usuários com acesso ativo do SGP",
      },
      { status: 500 },
    );
  }
}
