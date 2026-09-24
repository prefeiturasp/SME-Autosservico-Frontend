import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchMedicoesIniciais } from "@/actions/_helpers/sigpaeMetricas";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchMedicoesIniciais();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar medições iniciais do SIGPAE";
    return NextResponse.json(
      { error: errorMessage ?? "Erro ao consultar medições iniciais do SIGPAE" },
      { status: 500 },
    );
  }
}
