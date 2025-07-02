import { vi } from "vitest";

export const autenticaCoreSSOMock = {
  post: vi.fn(),
};

export const setupMocks = () => {
  vi.mock("next-auth", () => ({
    default: () => ({
      handlers: {},
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: vi.fn(),
    }),
    signIn: vi.fn(),
    signOut: vi.fn(),
    AuthError: class MockAuthError extends Error {
      constructor() {
        super("MockAuthError");
        this.name = "AuthError";
      }
      type = "CredentialsSignin";
    },
  }));

  vi.mock("next/server", () => ({}));

  vi.mock("@/lib/axios", () => ({
    autenticaCoreSSO: autenticaCoreSSOMock,
  }));

  return { autenticaCoreSSOMock };
};

export const resetEnv = () => {
  vi.stubEnv("AUTENTICA_CORESSO_API_TOKEN", "test-token");
  vi.stubEnv("AUTENTICA_CORESSO_API_URL", "https://api.test.com");
  vi.stubEnv("NEXTAUTH_SECRET", "test-secret");
  vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");
};

export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  autenticaCoreSSOMock.post.mockReset();
};
