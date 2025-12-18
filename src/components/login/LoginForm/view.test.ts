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
    const onError = vi.fn(); // Mudou de setErrorMessage para onError
    const values = {
        rf: "12345678",
        password: "admin123",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("NÃO chama onError quando autenticação é bem-sucedida", async () => {
        (authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

        const { onSubmit } = useView();

        await onSubmit(values, onError);

        expect(authenticate).toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled(); // Mudou: não deve chamar quando sucesso
    });

    it("chama onError com string de erro quando autenticação falha", async () => {
        (authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
            "Invalid credentials."
        );

        const { onSubmit } = useView();

        await onSubmit(values, onError);

        expect(authenticate).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith("Invalid credentials."); // Mantém o mesmo teste
    });

    it("chama authenticate com FormData correto", async () => {
        (authenticate as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

        const { onSubmit } = useView();

        await onSubmit(values, onError);

        // Verifica se authenticate foi chamado com FormData
        expect(authenticate).toHaveBeenCalledWith(undefined, expect.any(FormData));

        // Verifica o conteúdo do FormData
        const callArgs = (authenticate as ReturnType<typeof vi.fn>).mock.calls[0];
        const formData = callArgs[1] as FormData;
        expect(formData.get("rf")).toBe("12345678");
        expect(formData.get("password")).toBe("admin123");
    });
});
