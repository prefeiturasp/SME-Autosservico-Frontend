import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

function isSessionExpired(expiresAt: number | undefined): boolean {
    if (!expiresAt) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= expiresAt;
}

export default auth((req) => {
    const { pathname } = req.nextUrl;

    const protectedRoutes = ["/dashboard"];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const hasSession = !!req.auth;
    const sessionExpired = hasSession && isSessionExpired(req.auth?.expires_at);

    if (isProtectedRoute && (!hasSession || sessionExpired)) {
        const loginUrl = new URL("/", req.url);
        if (sessionExpired) {
            loginUrl.searchParams.set("expired", "true");
        }
        return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/" && hasSession && !sessionExpired) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
