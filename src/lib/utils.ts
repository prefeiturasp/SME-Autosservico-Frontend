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
