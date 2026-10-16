import { describe, it, expect } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

const NOW = new Date("2026-05-13T12:00:00Z");

describe("formatRelativeTime", () => {
  it("retorna '—' quando data ausente ou inválida", () => {
    expect(formatRelativeTime(undefined, NOW)).toBe("—");
    expect(formatRelativeTime("not-a-date", NOW)).toBe("—");
  });

  it("retorna 'agora' para datas muito recentes ou futuras", () => {
    expect(formatRelativeTime("2026-05-13T11:59:30Z", NOW)).toBe("agora");
    expect(formatRelativeTime("2026-05-13T12:00:10Z", NOW)).toBe("agora");
  });

  it("formata em minutos (singular e plural)", () => {
    expect(formatRelativeTime("2026-05-13T11:59:00Z", NOW)).toBe("há 1 minuto");
    expect(formatRelativeTime("2026-05-13T11:30:00Z", NOW)).toBe("há 30 minutos");
  });

  it("formata em horas", () => {
    expect(formatRelativeTime("2026-05-13T11:00:00Z", NOW)).toBe("há 1 hora");
    expect(formatRelativeTime("2026-05-12T22:00:00Z", NOW)).toBe("há 14 horas");
  });

  it("formata em dias", () => {
    expect(formatRelativeTime("2026-05-12T12:00:00Z", NOW)).toBe("há 1 dia");
    expect(formatRelativeTime("2026-05-08T12:00:00Z", NOW)).toBe("há 5 dias");
  });

  it("formata em meses", () => {
    expect(formatRelativeTime("2026-04-01T12:00:00Z", NOW)).toBe("há 1 mês");
    expect(formatRelativeTime("2026-02-01T12:00:00Z", NOW)).toBe("há 3 meses");
  });

  it("formata em anos", () => {
    expect(formatRelativeTime("2024-05-13T12:00:00Z", NOW)).toBe("há 2 anos");
  });
});
