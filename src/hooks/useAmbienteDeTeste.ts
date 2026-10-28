import { useSyncExternalStore } from "react";

/**
 * Os ambientes do Autosserviço se separam pelo domínio: qa-… (test) e
 * hom-… (homolog). Qualquer outro domínio conta como produção; localhost
 * é o desenvolvimento local.
 */
export const ehAmbienteDeTeste = (hostname: string) =>
  hostname === "localhost" ||
  hostname.startsWith("qa-") ||
  hostname.startsWith("hom-");

const semAssinatura = () => () => {};

/**
 * true em test, homolog e localhost. Na renderização do servidor vale
 * produção (false), e o navegador corrige ao hidratar.
 */
export const useAmbienteDeTeste = () =>
  useSyncExternalStore(
    semAssinatura,
    () => ehAmbienteDeTeste(globalThis.location.hostname),
    () => false,
  );
