import { render, screen, fireEvent } from "@testing-library/react";
import SignOutButton from "./SignOutButton";
import { vi } from "vitest";

// Mock da função signOut do next-auth/react
vi.mock("next-auth/react", () => ({
    signOut: vi.fn(),
}));

import { signOut } from "next-auth/react";

describe("SignOutButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza o botão "Sair"', () => {
        render(<SignOutButton />);
        expect(
            screen.getByRole("button", { name: /sair/i })
        ).toBeInTheDocument();
    });

    it('chama signOut com callbackUrl "/" ao clicar no botão', () => {
        render(<SignOutButton />);

        const button = screen.getByRole("button", { name: /sair/i });

        fireEvent.click(button);

        expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
});
