import { describe, it, expect } from "vitest";
import { SistemaSchema, SelectedSistemaSchema } from "./schema";

describe("SistemaSchema", () => {
    it("deve validar um objeto Sistema válido", () => {
        const validSistema = { id: "10", nome: "Novo SGP" };
        const result = SistemaSchema.safeParse(validSistema);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validSistema);
        }
    });

    it("deve falhar ao validar um objeto Sistema inválido", () => {
        const invalidSistema = { id: 10, nome: 123 }; // Tipos errados
        const result = SistemaSchema.safeParse(invalidSistema);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toContain("Expected string");
        }
    });
});

describe("SelectedSistemaSchema", () => {
    it("deve aceitar um ID válido", () => {
        const result = SelectedSistemaSchema.safeParse("10");

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe("10");
        }
    });

    it("deve falhar quando o valor é vazio", () => {
        const result = SelectedSistemaSchema.safeParse("");

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe("Selecione um sistema válido");
        }
    });

    it("deve falhar quando o valor é 'invalid'", () => {
        const result = SelectedSistemaSchema.safeParse("invalid");

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe("Opção inválida selecionada");
        }
    });
});
