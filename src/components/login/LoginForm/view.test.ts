import { describe, it, expect, vi, beforeEach } from "vitest";
import useView from "./view";

// Mock da função authenticate
vi.mock("@/lib/actions", () => ({
    authenticate: vi.fn(),
}));

vi.mock("react", async () => {
    const actual = await vi.importActual("react");
    return {
        ...actual,
        useTransition: vi.fn(() => [
            false, // isPending
            vi.fn((fn) => fn()), // startTransition - executa a função imediatamente
        ]),
    };
});

import { authenticate } from "@/lib/actions";

describe("useView", () => {
    const setErrorMessage = vi.fn();
    const values = {
        rf: "12345678",
        password: "admin123",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("chama setErrorMessage(null) quando autenticação é bem-sucedida", async () => {
        (authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

        const { onSubmit } = useView();

        await onSubmit(values, setErrorMessage);

        expect(authenticate).toHaveBeenCalled();
        expect(setErrorMessage).toHaveBeenCalledWith(null);
    });

    it("chama setErrorMessage com string de erro se for retornado", async () => {
        (authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
            "Invalid credentials."
        );

        const { onSubmit } = useView();

        await onSubmit(values, setErrorMessage);

        expect(authenticate).toHaveBeenCalled();
        expect(setErrorMessage).toHaveBeenCalledWith("Invalid credentials.");
    });

});
