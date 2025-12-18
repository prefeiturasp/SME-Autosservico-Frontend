import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Importa tipos e estratégias
//import { LoginData, LoginResponse } from "./types";
import { LoginData, LoginResponse } from "@/types/login";
import { loginCoreSSO, loginKeycloak } from "./strategies";
import { authorizeUser, jwtCallback, sessionCallback } from "./logic";


// Função principal de login: escolhe a estratégia
export async function Login(data: LoginData, version: "v1" | "v2" = "v1"): Promise<LoginResponse> {
    if (version === "v2") {
        return loginKeycloak(data);
    }
    return loginCoreSSO(data);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                rf: { label: "RF", type: "text", placeholder: "1234567" },
                password: { label: "Password", type: "password" },
            },
            authorize: authorizeUser, // pode ser adaptado para aceitar versão
        }),
    ],
    pages: { signIn: "/" },
    callbacks: {
        jwt: jwtCallback,
        session: sessionCallback,
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias - tempo de vida total
        updateAge: 24 * 60 * 60,   // 24 horas - intervalo entre renovações
    },
    cookies: {
        sessionToken: {
            options: {
                httpOnly: true,     // Impede acesso via JavaScript (XSS protection)
                sameSite: "lax",    // Proteção CSRF
                path: "/",
                secure: process.env.NODE_ENV === "production", // HTTPS em produção
                maxAge: 30 * 24 * 60 * 60, // 30 dias
            },
        },
    },
});
