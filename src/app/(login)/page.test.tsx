import { render, screen } from "@testing-library/react";
import Page from "../(login)/page";

// Mockando componentes usados na página
vi.mock("@/components/login/LoginForm", () => ({
    __esModule: true,
    default: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));

vi.mock("@/components/ui/Navbar", () => ({
    __esModule: true,
    default: () => <nav data-testid="navbar">Mocked Navbar</nav>,
}));

describe("Página inicial (src/app/page.tsx)", () => {
    it("renderiza Navbar e LoginForm corretamente", () => {
        render(<Page />);
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
});
