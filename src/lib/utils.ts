import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function numberToBRL(n: number): string {
  const absValue = Math.abs(n).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return n < 0 ? `R$ -${absValue.replace("R$", "").trim()}` : absValue;
}

export function formatDDMMYYYY_HHMM_FromSeconds(seconds?: number): string | undefined {
    if (!seconds || !isFinite(seconds)) return undefined;
    const d = new Date(seconds * 1000);
    if (isNaN(d.getTime())) return undefined;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function formatDDMMYYYY_HHMM_FromMillis(ms?: number): string | undefined {
    if (!ms || !isFinite(ms)) return undefined;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return undefined;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function formatDurationMs(ms?: number): string | undefined {
    if (ms === undefined || ms === null) return undefined;
    if (!isFinite(ms) || ms < 0) return undefined;

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

export function formatCpfMasked(cpf?: string): string | undefined {
    if (!cpf) return undefined;
    const digits = cpf.replace(/\D/g, "").padStart(11, "0");
    if (digits.length !== 11) return undefined;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.xxx-xx`;
}

export function formatUltimoAcesso(value?: string): string | undefined {
    if (!value) return undefined;
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value);
    if (!match) return value;
    const [, yyyy, mm, dd, hh, mi] = match;
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function decodeJwt(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
}
