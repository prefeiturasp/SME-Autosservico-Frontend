"use server";

import { signIn } from "./auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const rf = formData.get("rf");
        const password = formData.get("password");

        await signIn("credentials", {
            rf,
            password,
            redirectTo: "/dashboard",
            redirect: true,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciais inválidas.";
                case "CallbackRouteError":
                    // Captura erros customizados do authorize
                    const message = error.cause?.err?.message;
                    if (message) {
                        return message;
                    }
                    return "Erro na autenticação.";
                default:
                    return "Algo deu errado. Tente novamente.";
            }
        }
        throw error;
    }
}
