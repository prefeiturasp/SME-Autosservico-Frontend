import type { SonarRating } from "@/types/sonarqube";

function formatCount(value: number): string {
  return value.toLocaleString("pt-BR");
}

function formatKLines(value: number): string {
  if (value < 1000) return `${formatCount(value)} linhas`;
  const inK = value / 1000;
  const rounded = Math.round(inK * 10) / 10;
  return `${rounded.toLocaleString("pt-BR")}k linhas`;
}

export function bugsHelper(value: number, rating: SonarRating): string {
  if (value === 0) return "Sem problemas encontrados";
  if (rating === "A" || rating === "B") return "Dentro do limite";
  return "Acima do limite";
}

export function vulnerabilitiesHelper(value: number): string {
  if (value === 0) return "Sem problemas encontrados";
  if (value === 1) return "1 problema encontrado";
  return `${formatCount(value)} problemas encontrados`;
}

export function coverageHelper(minimum: number): string {
  return `Mínimo: ${minimum}%`;
}

export function duplicationHelper(maximum: number): string {
  return `Máximo: ${maximum}%`;
}

export function codeSmellsHelper(ncloc: number): string {
  return formatKLines(ncloc);
}

export function securityHotspotsHelper(value: number): string {
  if (value === 0) return "Sem trechos para revisar";
  return "Trechos que requerem revisão";
}
