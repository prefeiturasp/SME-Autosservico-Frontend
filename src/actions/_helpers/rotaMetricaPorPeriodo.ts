import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolverPeriodo } from "@/actions/_helpers/sgpMetricas";

type FetcherDeRota<T> = (searchParams: URLSearchParams) => Promise<T>;
type FetcherPorPeriodo<T> = (anoLetivo: number, bimestre: number) => Promise<T>;

/**
 * Monta o handler GET de uma rota de métrica.
 *
 * Exige sessão (401 sem login), entrega a query string ao fetcher e devolve
 * o resultado; em erro, 500 com a mensagem do erro ou a mensagem padrão da
 * rota.
 */
export function criarRotaMetrica<T>(
  fetcher: FetcherDeRota<T>,
  mensagemPadrao: string,
) {
  return async function GET(request: Request) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return NextResponse.json(
        await fetcher(new URL(request.url).searchParams),
      );
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

/**
 * Rota de métrica por ano letivo + bimestre: lê o período da query (com
 * fallback para o período corrente) e repassa ao fetcher.
 */
export function criarRotaMetricaPorPeriodo<T>(
  fetcher: FetcherPorPeriodo<T>,
  mensagemPadrao: string,
) {
  return criarRotaMetrica((searchParams) => {
    const { anoLetivo, bimestre } = resolverPeriodo(searchParams);
    return fetcher(anoLetivo, bimestre);
  }, mensagemPadrao);
}
