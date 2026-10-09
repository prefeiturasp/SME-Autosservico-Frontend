import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolverPeriodo } from "@/actions/_helpers/sgpMetricas";

type FetcherPorPeriodo<T> = (anoLetivo: number, bimestre: number) => Promise<T>;

/**
 * Monta o handler GET de uma rota de métrica por ano letivo + bimestre.
 *
 * Exige sessão (401 sem login), lê o período da query (com fallback para o
 * período corrente) e devolve o resultado do fetcher; em erro, 500 com a
 * mensagem do erro ou a mensagem padrão da rota.
 */
export function criarRotaMetricaPorPeriodo<T>(
  fetcher: FetcherPorPeriodo<T>,
  mensagemPadrao: string,
) {
  return async function GET(request: Request) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { anoLetivo, bimestre } = resolverPeriodo(
        new URL(request.url).searchParams,
      );
      return NextResponse.json(await fetcher(anoLetivo, bimestre));
    } catch (e: unknown) {
      const errorMessage =
        typeof e === "object" && e !== null && "message" in e
          ? (e as { message?: string }).message
          : mensagemPadrao;
      return NextResponse.json(
        { error: errorMessage ?? mensagemPadrao },
        { status: 500 },
      );
    }
  };
}
