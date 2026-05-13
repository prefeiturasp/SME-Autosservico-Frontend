export function formatRelativeTime(iso: string | undefined, now: Date = new Date()): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const diffMs = now.getTime() - then;
  if (diffMs < 0) return "agora";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "agora";
  if (minutes < 60) return `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  if (hours < 24) return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}
