import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useView from "./view";
import { SelectedSistemaSchema } from "./schema";

// ✅ Mock do console
const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("useView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve chamar console.log quando o ID for válido", () => {
        // ✅ Mock do Zod para sempre retornar sucesso
        vi.spyOn(SelectedSistemaSchema, "safeParse").mockReturnValue({
            success: true,
            data: "10",
        });

        const { result } = renderHook(() => useView());

        act(() => {
            result.current.handleSelectChange("10");
        });

        expect(consoleLogSpy).toHaveBeenCalledWith("Valor válido:", "10");
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("deve chamar console.error quando o ID for inválido", () => {
        // ✅ Mock do Zod para retornar erro
        vi.spyOn(SelectedSistemaSchema, "safeParse").mockReturnValue({
            success: false,
            error: {
                errors: [
                    {
                        message: "ID inválido",
                    },
                ],
            },
        } as unknown as ReturnType<typeof SelectedSistemaSchema.safeParse>);

        const { result } = renderHook(() => useView());

        act(() => {
            result.current.handleSelectChange("ABC");
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Erro de validação:",
            "ID inválido"
        );
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });
});
