import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolverPeriodo } from "@/actions/_helpers/sgpMetricas";

type FetcherPorPeriodo<T> = (anoLetivo: number, bimestre: number) => Promise<T>;

/**
 * Monta o handler GET de uma rota de métrica.
 *
 * Exige sessão (401 sem login), converte a query nos parâmetros do fetcher
 * via `resolverParametros` e devolve o resultado; em erro, 500 com a
 * mensagem do erro ou a mensagem padrão da rota.
 */
export function criarRotaMetrica<P, T>(
  resolverParametros: (searchParams: URLSearchParams) => P,
  fetcher: (parametros: P) => Promise<T>,
  mensagemPadrao: string,
) {
  return async function GET(request: Request) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const parametros = resolverParametros(new URL(request.url).searchParams);
      return NextResponse.json(await fetcher(parametros));
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
 * Rota de métrica por ano letivo + bimestre (com fallback para o período
 * corrente quando ausentes na query).
 */
export function criarRotaMetricaPorPeriodo<T>(
  fetcher: FetcherPorPeriodo<T>,
  mensagemPadrao: string,
) {
  return criarRotaMetrica(
    resolverPeriodo,
    ({ anoLetivo, bimestre }) => fetcher(anoLetivo, bimestre),
    mensagemPadrao,
  );
}
