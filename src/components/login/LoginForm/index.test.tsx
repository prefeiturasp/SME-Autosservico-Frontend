import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { vi } from "vitest";

// Mock da função de submit da view
const mockOnSubmit = vi.fn();

// Mock do hook useView
vi.mock("./view", () => ({
    default: () => ({
        onSubmit: mockOnSubmit,
    }),
}));

// Mock de dependências visuais
vi.mock("../BackgroundForm", () => ({
    default: () => <div data-testid="mock-background-form" />,
}));

vi.mock("@/assets/images/logo_devops.webp", () => ({
    default: {
        src: "/fake-logo.webp",
        width: 100,
        height: 100,
    },
}));

describe("LoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza os campos de RF e senha", async () => {
        render(<LoginForm />);
        expect(
            await screen.findByPlaceholderText("Digite o seu RF...")
        ).toBeInTheDocument();
        expect(
            await screen.findByPlaceholderText("Digite a sua senha...")
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("button", { name: /entrar/i })
        ).toBeInTheDocument();
    });

    it("exibe mensagem de erro ao submeter com credenciais inválidas", async () => {
        mockOnSubmit.mockImplementationOnce(
            async (_values, setErrorMessage) => {
                setErrorMessage("Invalid credentials.");
            }
        );

        render(<LoginForm />);

        fireEvent.input(screen.getByLabelText(/rf/i), {
            target: { value: "12345678" }, // válido
        });

        fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), {
            target: { value: "senhaerrada" },
        });

        const btn = screen.getByRole("button", { name: /entrar/i });
        await waitFor(() => expect(btn).not.toBeDisabled());
        fireEvent.click(btn);

        await waitFor(() =>
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        );
    });

    test("realiza login com credenciais válidas e não mostra erro", async () => {
        mockOnSubmit.mockImplementationOnce(
            async (_values, setErrorMessage) => {
                setErrorMessage(null);
            }
        );

        render(<LoginForm />);

        fireEvent.input(screen.getByPlaceholderText("Digite o seu RF..."), {
            target: { value: "12345678" }, // válido
        });

        fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), {
            target: { value: "admin123" },
        });

        const btn = screen.getByRole("button", { name: /entrar/i });
        await waitFor(() => expect(btn).not.toBeDisabled());
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
            expect(
                screen.queryByText(/invalid credentials/i)
            ).not.toBeInTheDocument();
        });
    });

    test("alterna visibilidade da senha ao clicar no botão de mostrar/ocultar", async () => {
        render(<LoginForm />);

        const passwordInput = await screen.findByPlaceholderText(
            "Digite a sua senha..."
        );
        const toggleButton = screen.getByRole("button", {
            name: /senha invisível|senha visível/i,
        });

        // Visibilidade: oculto → visível → oculto
        expect(passwordInput).toHaveAttribute("type", "password");
        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");
        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("desabilita o botão 'Entrar' até que RF e senha sejam preenchidos corretamente", async () => {
        render(<LoginForm />);

        const btn = await screen.findByRole("button", { name: /entrar/i });
        const inputRf = screen.getByPlaceholderText("Digite o seu RF...");
        const inputPassword = screen.getByPlaceholderText(
            "Digite a sua senha..."
        );

        // Inicialmente desabilitado
        expect(btn).toBeDisabled();

        // Preenche apenas o RF
        fireEvent.input(inputRf, { target: { value: "12345678" } });
        await waitFor(() => {
            expect(btn).toBeDisabled(); // ainda desabilitado
        });

        // Limpa RF e preenche apenas senha
        fireEvent.input(inputRf, { target: { value: "" } });
        fireEvent.input(inputPassword, { target: { value: "senha123" } });
        await waitFor(() => {
            expect(btn).toBeDisabled(); // ainda desabilitado
        });

        // Preenche ambos corretamente
        fireEvent.input(inputRf, { target: { value: "12345678" } });
        await waitFor(() => {
            expect(btn).not.toBeDisabled(); // agora está habilitado
        });
    });
});
