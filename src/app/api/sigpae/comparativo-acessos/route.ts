import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchComparativoAcessos } from "@/actions/_helpers/sigpaeMetricas";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await fetchComparativoAcessos());
  } catch (e: unknown) {
    const msg =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { error: msg ?? "Erro ao consultar o comparativo de acessos" },
      { status: 500 },
    );
  }
}
