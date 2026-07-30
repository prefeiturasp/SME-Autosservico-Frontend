/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import type { CoordenadoriaAcesso } from "@/types/coordenadoriaAcesso";
import PerfilPage from "./page";

vi.mock("next-auth/react", () => ({
    __esModule: true,
    useSession: vi.fn(),
}));

vi.mock("@/hooks/useAreasAcesso", () => ({
    useAreasAcesso: vi.fn(() => [] as CoordenadoriaAcesso[]),
}));

vi.mock("@/components/perfil/IdentityCard", () => ({
    IdentityCard: (props: Record<string, unknown>) => (
        <div data-testid="identity-card">{JSON.stringify(props)}</div>
    ),
}));

vi.mock("@/components/perfil/AccountActionsCard", () => ({
    AccountActionsCard: () => <div data-testid="account-actions-card" />,
}));

vi.mock("@/components/perfil/DadosPessoaisCard", () => ({
    DadosPessoaisCard: (props: Record<string, unknown>) => (
        <div data-testid="dados-pessoais-card">{JSON.stringify(props)}</div>
    ),
}));

vi.mock("@/components/perfil/AreasAcessoCard", () => ({
    AreasAcessoCard: (props: Record<string, unknown>) => (
        <div data-testid="areas-acesso-card">{JSON.stringify(props)}</div>
    ),
}));

import { useSession } from "next-auth/react";
import { useAreasAcesso } from "@/hooks/useAreasAcesso";

const mockUseSession = vi.mocked(useSession);
const mockUseAreasAcesso = vi.mocked(useAreasAcesso);

function buildSession(user: Partial<Session["user"]>): Session {
    return {
        user: { rf: "1234567", ...user },
        expires: "2099-01-01T00:00:00.000Z",
    } as Session;
}

describe("PerfilPage", () => {
    const OLD_ENV = { ...process.env };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAreasAcesso.mockReturnValue([]);
        process.env = { ...OLD_ENV };
        delete process.env.NEXT_PUBLIC_AUTH_VERSION;
    });

    afterAll(() => {
        process.env = { ...OLD_ENV };
    });

    it("renderiza o título 'Meu perfil'", () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        expect(screen.getByText("Meu perfil")).toBeInTheDocument();
    });

    it("usa EMPTY_FIELD ('—') quando não há sessão", () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        const identity = JSON.parse(
            screen.getByTestId("identity-card").textContent ?? "{}",
        );
        expect(identity.nomeCompleto).toBe("—");
        expect(identity.cargo).toBe("—");
        expect(identity.coordenadoria).toBe("—");
        expect(identity.ultimoAcesso).toBe("—");
        expect(identity.tempoSessao).toBe("—");

        const dados = JSON.parse(
            screen.getByTestId("dados-pessoais-card").textContent ?? "{}",
        );
        expect(dados.cpf).toBe("—");
        expect(dados.email).toBe("—");
    });

    it("mapeia os dados da sessão para os cards (v1, conta ativa)", () => {
        mockUseSession.mockReturnValue({
            data: buildSession({
                name: "Fulano de Tal",
                cpf: "12345678901",
                email: "fulano@sme.sp.gov.br",
                cargo: "Analista",
                coordenadoria: "COTIC",
                situacaoUsuario: 1,
                ultimo_acesso: "2026-07-20 10:00:00",
                tempo_sessao: "01:30",
            }),
            status: "authenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        const identity = JSON.parse(
            screen.getByTestId("identity-card").textContent ?? "{}",
        );
        expect(identity.nomeCompleto).toBe("Fulano de Tal");
        expect(identity.cargo).toBe("Analista");
        expect(identity.coordenadoria).toBe("COTIC");
        expect(identity.contaAtiva).toBe(true);
        expect(identity.ultimoAcesso).toBe("20/07/2026 10:00");
        expect(identity.tempoSessao).toBe("01:30");

        const dados = JSON.parse(
            screen.getByTestId("dados-pessoais-card").textContent ?? "{}",
        );
        expect(dados.cpf).toBe("123.456.xxx-xx");
        expect(dados.email).toBe("fulano@sme.sp.gov.br");
    });

    it("marca contaAtiva=false quando situacaoUsuario não for 1 (v1)", () => {
        mockUseSession.mockReturnValue({
            data: buildSession({ situacaoUsuario: 0 }),
            status: "authenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        const identity = JSON.parse(
            screen.getByTestId("identity-card").textContent ?? "{}",
        );
        expect(identity.contaAtiva).toBe(false);
    });

    it("marca contaAtiva=true sempre quando AUTH_VERSION for 'v2', independente de situacaoUsuario", () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";

        mockUseSession.mockReturnValue({
            data: buildSession({ situacaoUsuario: 0 }),
            status: "authenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        const identity = JSON.parse(
            screen.getByTestId("identity-card").textContent ?? "{}",
        );
        expect(identity.contaAtiva).toBe(true);
    });

    it("repassa as coordenadorias de useAreasAcesso para o AreasAcessoCard", () => {
        const coordenadorias: CoordenadoriaAcesso[] = [
            { sigla: "COPED", descricao: "SGP", areas: ["Operacional"] },
        ];
        mockUseAreasAcesso.mockReturnValue(coordenadorias);
        mockUseSession.mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        const areas = JSON.parse(
            screen.getByTestId("areas-acesso-card").textContent ?? "{}",
        );
        expect(areas.coordenadorias).toEqual(coordenadorias);
    });

    it("renderiza o AccountActionsCard", () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: vi.fn(),
        });

        render(<PerfilPage />);

        expect(screen.getByTestId("account-actions-card")).toBeInTheDocument();
    });
});
