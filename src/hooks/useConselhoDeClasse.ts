import type { StatItem } from "@/types/metricas";
import {
  useSgpBimestreQuery,
  type SgpBimestreOptions,
} from "./_helpers/sgpBimestreQuery";

export function useConselhoDeClasse(options: SgpBimestreOptions) {
  return useSgpBimestreQuery<StatItem[]>(
    "conselho-de-classe",
    "/api/sgp/conselho-de-classe",
    options,
  );
}
