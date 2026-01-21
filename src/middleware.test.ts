import { describe, it, expect, vi, afterEach } from "vitest";
import middleware from "@/middleware";
import { NextResponse, type NextRequest } from "next/server";

declare module "next/server" {
    interface NextRequest {
        auth: unknown;
    }
}

// Mock do NextAuth
vi.mock("@/lib/auth", () => ({
    auth: vi.fn().mockImplementation((callback) => {
        return async (req: NextRequest) => {
            req.auth = mockAuthState;
            return callback(req);
        };
    }),
}));

// Mock do NextResponse
vi.mock("next/server", () => ({
    NextResponse: {
        redirect: vi.fn((url) => ({
            _type: "redirect",
            url: url.toString(),
        })),
        next: vi.fn(() => ({
            _type: "next",
        })),
    },
}));

// Estado global de autenticação para os testes
let mockAuthState: unknown = null;

// Tipo correto para o contexto do middleware
type AppRouteHandlerFnContext = {
    params: Promise<unknown>;
};

// Função para criar contexto de mock correto
const createMockContext = (): AppRouteHandlerFnContext => ({
    params: Promise.resolve({}),
});

// Função para simular uma NextRequest completa
const createMockRequest = (url: string): NextRequest => {
    const headers = new Headers();
    const nextUrl = new URL(url, "http://localhost:3000");

    return {
        nextUrl,
        url: nextUrl.toString(),
        cookies: {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            has: vi.fn(),
            getAll: vi.fn(),
        },
        geo: {
            city: "Test City",
            country: "Test Country",
            region: "Test Region",
            latitude: "0",
            longitude: "0",
        },
        ip: "127.0.0.1",
        ua: "Test User Agent",
        headers,
        method: "GET",
        json: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        clone: vi.fn(),
        signal: new AbortController().signal,
        next: vi.fn(),
        // Adicionamos a propriedade auth que será usada pelo middleware
        auth: null,
    } as unknown as NextRequest;
};

describe("Middleware de Autenticação", () => {
    afterEach(() => {
        vi.clearAllMocks();
        mockAuthState = null;
    });

    // Testes para Rotas Protegidas
    describe("Rotas Protegidas", () => {
        it("deve permitir acesso quando autenticado", async () => {
            mockAuthState = { user: { name: "John Doe" } };
            const req = createMockRequest("/dashboard");
            const ctx = createMockContext();
            const result = await middleware(req, ctx);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(result).toEqual({ _type: "next" });
        });
    });

    // Testes para Redirecionamentos de Login
    describe("Redirecionamentos de Login", () => {
        it("deve redirecionar usuário autenticado para /dashboard ao acessar /", async () => {
            mockAuthState = { user: { name: "John Doe" } };
            const req = createMockRequest("/");
            const ctx = createMockContext();
            await middleware(req, ctx);

            expect(NextResponse.redirect).toHaveBeenCalledWith(
                new URL("http://localhost:3000/dashboard")
            );
        });

        it("não deve redirecionar usuário não autenticado em /login", async () => {
            const req = createMockRequest("/login");
            const ctx = createMockContext();
            await middleware(req, ctx);

            expect(NextResponse.next).toHaveBeenCalled();
        });
    });

    // Testes para Rotas Públicas
    describe("Rotas Públicas", () => {
        const publicRoutes = ["/about", "/contact", "/public-page"];

        it.each(publicRoutes)(
            "deve permitir acesso não autenticado em %s",
            async (route) => {
                const req = createMockRequest(route);
                const ctx = createMockContext();
                await middleware(req, ctx);

                expect(NextResponse.next).toHaveBeenCalled();
            }
        );

        it.each(publicRoutes)(
            "deve permitir acesso autenticado em %s",
            async (route) => {
                mockAuthState = { user: { name: "John Doe" } };
                const req = createMockRequest(route);
                const ctx = createMockContext();
                await middleware(req, ctx);

                expect(NextResponse.next).toHaveBeenCalled();
            }
        );
    });

    // Testes para Exclusões do Middleware
    describe("Exclusões do Middleware", () => {
        const excludedRoutes = [
            "/api/endpoint",
            "/_next/static/file.js",
            "/_next/image",
            "/favicon.ico",
        ];

        it.each(excludedRoutes)(
            "não deve processar rota excluída: %s",
            async (route) => {
                const req = createMockRequest(route);
                const ctx = createMockContext();
                await middleware(req, ctx);

                expect(NextResponse.next).toHaveBeenCalled();
            }
        );
    });

    it("deve proteger sub-rotas do dashboard", async () => {
        const routes = [
            "/dashboard/settings",
            "/dashboard/profile",
            "/dashboard/reports",
        ];

        for (const route of routes) {
            const req = createMockRequest(route);
            const ctx = createMockContext();
            await middleware(req, ctx);

            expect(NextResponse.redirect).toHaveBeenCalledWith(
                new URL("http://localhost:3000/")
            );
        }
    });

    it("deve proteger rotas dinâmicas", async () => {
        const req = createMockRequest("/dashboard/user/123");
        const ctx = createMockContext();
        // Forçar parâmetros dinâmicos no contexto
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx as any).params = { userId: "123" };

        await middleware(req, ctx);

        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("http://localhost:3000/")
        );
    });
});
