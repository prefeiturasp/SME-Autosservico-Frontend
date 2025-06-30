import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Rotas protegidas
    const protectedRoutes = ["/dashboard"];

    // Verificar se a rota atual é protegida
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Se a rota é protegida e o usuário não está autenticado
    if (isProtectedRoute && !req.auth) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Se o usuário está autenticado e tenta acessar a página de login ou a raiz
    // redireciona para o dashboard
    if (pathname === "/" && req.auth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
