export type BimestreOption = {
  value: string;
  label: string;
};

export const BIMESTRE_OPTIONS: ReadonlyArray<BimestreOption> = [
  { value: "2025-3", label: "3º Bimestre de 2025" },
  { value: "2025-4", label: "4º Bimestre de 2025" },
  { value: "2026-1", label: "1º Bimestre de 2026" },
  { value: "2026-2", label: "2º Bimestre de 2026" },
];

export const DEFAULT_BIMESTRE = "2026-2";
