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

        const retorno = await signIn("credentials", {
            rf,
            password,
            redirectTo: "/dashboard",
            redirect: true,
        });

        console.log("Retorno do signIn:", retorno);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
