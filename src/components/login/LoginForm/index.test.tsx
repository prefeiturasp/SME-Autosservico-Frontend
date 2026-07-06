/* @vitest-environment jsdom */
// src/components/login/LoginForm/index.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { vi, beforeEach, describe, it, test, expect } from "vitest";

// Mock dinâmico do estado de loading do submit
let mockIsPending = false;

// Mock da função de submit da view
const mockOnSubmit = vi.fn();

// Mock do hook useView (retorna onSubmit + isPending mutável)
vi.mock("./view", () => ({
  __esModule: true,
  default: () => ({
    onSubmit: mockOnSubmit,
    isPending: mockIsPending,
  }),
}));

// Mock de dependências visuais
vi.mock("../BackgroundForm", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-background-form" />,
}));

// Mock da const usada no título condicional do alerta
vi.mock("@/const", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/const")>(); // importa o módulo real
  return {
    __esModule: true,
    ...actual, // mantém RF_ERROR_MESSAGE, PASSWORD_ERROR_MESSAGE, RF_FORMAT_ERROR_MESSAGE etc.
    PERFIL_NOT_PERMISSION_ERROR_MESSAGE: "Você não tem permissão para acessar este sistema.", // sobrescreve só o necessário no teste
  };
});
vi.mock("@/assets/images/logo_devops.svg", () => ({
  __esModule: true,
  default: { src: "/fake-logo.svg", width: 208, height: 43 },
}));

vi.mock("@/assets/images/logo_prefeitura.svg", () => ({
  __esModule: true,
  default: { src: "/fake-prefeitura.svg", width: 216, height: 88 },
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img"> & { src: string | { src: string } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, fetchPriority: _unused, ...rest } = props;
    const resolvedSrc =
      typeof src === "object" && src !== null && "src" in src
        ? (src as { src: string }).src
        : src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={props.alt ?? ""} {...rest} />;
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending = false;
  });

  it("renderiza os campos de RF e senha", async () => {
    render(<LoginForm />);
    expect(await screen.findByPlaceholderText("Digite o seu RF...")).toBeInTheDocument();
    expect(await screen.findByPlaceholderText("Digite a sua senha...")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("exibe mensagem de erro ao submeter com credenciais inválidas (mostra título 'Vamos tentar de novo?')", async () => {
    mockOnSubmit.mockImplementationOnce(async (_values, setErrorMessage) => {
      setErrorMessage("Invalid credentials.");
    });

    render(<LoginForm />);

    fireEvent.input(screen.getByLabelText(/Registro Funcional/i), { target: { value: "12345678" } });
    fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), { target: { value: "senhaerrada" } });

    const btn = screen.getByRole("button", { name: /entrar/i });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);

    // mensagem + título condicional devem aparecer
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
    expect(screen.getByText(/vamos tentar de novo\?/i)).toBeInTheDocument();
  });

  test("realiza login com credenciais válidas e não mostra erro", async () => {
    mockOnSubmit.mockImplementationOnce(async (_values, setErrorMessage) => {
      setErrorMessage(null);
    });

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText("Digite o seu RF..."), { target: { value: "12345678" } });
    fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), { target: { value: "admin123" } });

    const btn = screen.getByRole("button", { name: /entrar/i });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  test("alterna visibilidade da senha ao clicar no botão de mostrar/ocultar", async () => {
    render(<LoginForm />);

    const passwordInput = await screen.findByPlaceholderText("Digite a sua senha...");
    const toggleButton = screen.getByRole("button", { name: /senha invisível|senha visível/i });

    // oculto → visível → oculto
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
    const inputPassword = screen.getByPlaceholderText("Digite a sua senha...");

    // Inicialmente desabilitado
    expect(btn).toBeDisabled();

    // Preenche apenas o RF
    fireEvent.input(inputRf, { target: { value: "12345678" } });
    await waitFor(() => expect(btn).toBeDisabled());

    // Limpa RF e preenche apenas senha
    fireEvent.input(inputRf, { target: { value: "" } });
    fireEvent.input(inputPassword, { target: { value: "senha123" } });
    await waitFor(() => expect(btn).toBeDisabled());

    // Preenche ambos corretamente
    fireEvent.input(inputRf, { target: { value: "12345678" } });
    await waitFor(() => expect(btn).not.toBeDisabled());
  });

  // ✅ NOVO: não renderiza o título "Vamos tentar de novo?" para erro de permissão
  it("não mostra o título quando erro é PERFIL_NOT_PERMISSION_ERROR_MESSAGE", async () => {
    mockOnSubmit.mockImplementationOnce(async (_values, setErrorMessage) => {
      setErrorMessage("Você não tem permissão para acessar este sistema."); // igual ao mock de @/const
    });

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText("Digite o seu RF..."), { target: { value: "12345678" } });
    fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), { target: { value: "senha" } });

    const btn = screen.getByRole("button", { name: /entrar/i });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/você não tem permissão/i)).toBeInTheDocument();
      expect(screen.queryByText(/vamos tentar de novo\?/i)).not.toBeInTheDocument(); // <- branch coberto
    });
  });

  // ✅ NOVO: limpa o alerta quando o RF é alterado após um erro
  it("remove o alerta após erro quando o usuário altera o RF (useEffect de limpeza)", async () => {
    mockOnSubmit.mockImplementationOnce(async (_values, setErrorMessage) => {
      setErrorMessage("Invalid credentials.");
    });

    render(<LoginForm />);

    const rfInput = screen.getByPlaceholderText("Digite o seu RF...");
    const pwInput = screen.getByPlaceholderText("Digite a sua senha...");

    fireEvent.input(rfInput, { target: { value: "12345678" } });
    fireEvent.input(pwInput, { target: { value: "senhaerrada" } });

    const btn = screen.getByRole("button", { name: /entrar/i });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);

    // alerta aparece
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());

    // altera RF → efeito deve limpar o erro
    fireEvent.input(rfInput, { target: { value: "87654321" } });

    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  // ✅ NOVO: botão permanece desabilitado quando isPending=true mesmo com formulário válido
  it("mantém 'Entrar' desabilitado enquanto isPending=true", async () => {
    mockIsPending = true;

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText("Digite o seu RF..."), { target: { value: "12345678" } });
    fireEvent.input(screen.getByPlaceholderText("Digite a sua senha..."), { target: { value: "senha123" } });

    const btn = screen.getByRole("button", { name: /entrar/i });
    // Mesmo válido, deve continuar desabilitado porque isPending=true
    await waitFor(() => expect(btn).toBeDisabled());
  });
});
