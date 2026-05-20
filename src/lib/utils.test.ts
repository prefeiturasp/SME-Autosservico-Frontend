import { describe, expect, it } from "vitest";
import {
    cn,
    decodeJwt,
    formatDDMMYYYY_HHMM_FromMillis,
    formatDurationMs,
    numberToBRL,
} from "./utils";

describe("Função cn (clsx + tailwind-merge)", () => {
    it("retorna uma string combinada de classes", () => {
        const result = cn("p-2", "text-sm", "text-center");
        expect(result).toBe("p-2 text-sm text-center");
    });

    it("remove classes duplicadas do Tailwind", () => {
        const result = cn("text-sm", "text-lg");
        expect(result).toBe("text-lg"); // tailwind-merge dá prioridade à última
    });

    it("ignora valores falsy (null, undefined, false)", () => {
        const result = cn("p-2", null, undefined, false, "text-sm");
        expect(result).toBe("p-2 text-sm");
    });

    it("lida com entradas booleanas e objetos (clsx)", () => {
        const result = cn("p-2", { "text-sm": true, "text-lg": false });
        expect(result).toBe("p-2 text-sm");
    });
});

describe("Função numberToBRL", () => {
    it("formata corretamente o número em moeda BRL", () => {
        expect(numberToBRL(1234.5)).toBe("R$ 1.234,50");
    });

    it("formata zero corretamente", () => {
        expect(numberToBRL(0)).toBe("R$ 0,00");
    });

    it("formata números grandes corretamente", () => {
        expect(numberToBRL(9876543.21)).toBe("R$ 9.876.543,21");
    });

    it("formata número negativo corretamente", () => {
        expect(numberToBRL(-2500.75)).toBe("R$ -2.500,75");
    });
});

describe("decodeJwt", () => {
    it("decodifica um JWT válido", () => {
        // header: {"alg":"HS256","typ":"JWT"}
        // payload: {"name":"Angela","groups":["G1","G2"]}
        const payload = { name: "Angela", groups: ["G1", "G2"] };
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
            "base64url",
        );
        const token = `aaa.${base64Payload}.zzz`;
        expect(decodeJwt(token)).toEqual(payload);
    });

    it("lança erro se o token não tem dois pontos", () => {
        expect(() => decodeJwt("invalidtoken")).toThrow();
    });

    it("lança erro se o payload não é base64 válido", () => {
        expect(() => decodeJwt("aaa.notbase64.zzz")).toThrow();
    });

    it("lança erro se o payload não é JSON válido", () => {
        const badBase64 = Buffer.from("notjson").toString("base64url");
        expect(() => decodeJwt(`aaa.${badBase64}.zzz`)).toThrow();
    });
});

describe("formatDurationMs", () => {
    it("formata duração em segundos", () => {
        expect(formatDurationMs(900)).toBe("0s");
        expect(formatDurationMs(1000)).toBe("1s");
    });

    it("formata duração em minutos e segundos", () => {
        expect(formatDurationMs(88873)).toBe("1m 28s");
    });

    it("retorna undefined quando ms é undefined", () => {
        expect(formatDurationMs(undefined)).toBeUndefined();
    });

    it("retorna undefined quando ms é null", () => {
        expect(formatDurationMs(null as unknown as number)).toBeUndefined();
    });

    it("retorna undefined quando ms é negativo", () => {
        expect(formatDurationMs(-1)).toBeUndefined();
    });

    it("retorna undefined quando ms é Infinity", () => {
        expect(formatDurationMs(Infinity)).toBeUndefined();
    });

    it("formata duração em horas, minutos e segundos", () => {
        expect(formatDurationMs(3661000)).toBe("1h 1m 1s");
    });
});

describe("formatDDMMYYYY_HHMM_FromMillis", () => {
    it("formata data a partir de milissegundos", () => {
        const ms = 1706266134892;
        const d = new Date(ms);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        expect(formatDDMMYYYY_HHMM_FromMillis(ms)).toBe(
            `${dd}/${mm}/${yyyy} ${hh}:${mi}`,
        );
    });

    it("retorna undefined quando ms é undefined", () => {
        expect(formatDDMMYYYY_HHMM_FromMillis(undefined)).toBeUndefined();
    });

    it("retorna undefined quando ms é 0", () => {
        expect(formatDDMMYYYY_HHMM_FromMillis(0)).toBeUndefined();
    });

    it("retorna undefined quando ms é Infinity", () => {
        expect(formatDDMMYYYY_HHMM_FromMillis(Infinity)).toBeUndefined();
    });

    it("retorna undefined quando ms gera data inválida", () => {
        expect(
            formatDDMMYYYY_HHMM_FromMillis(Number.MAX_VALUE),
        ).toBeUndefined();
    });
});
