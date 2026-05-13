function pluralize(value: number, singular: string, plural: string): string {
  return `há ${value} ${value === 1 ? singular : plural}`;
}

export function formatRelativeTime(iso: string | undefined, now: Date = new Date()): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const diffSeconds = Math.floor((now.getTime() - then) / 1000);
  if (diffSeconds < 60) return "agora";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return pluralize(minutes, "minuto", "minutos");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return pluralize(hours, "hora", "horas");

  const days = Math.floor(hours / 24);
  if (days < 30) return pluralize(days, "dia", "dias");

  const months = Math.floor(days / 30);
  if (months < 12) return pluralize(months, "mês", "meses");

  const years = Math.floor(days / 365);
  return pluralize(years, "ano", "anos");
}
