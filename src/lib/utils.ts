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


export function decodeJwt(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
}
