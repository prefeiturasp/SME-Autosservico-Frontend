import { auth } from "@/lib/auth";
import SignOutButton from "@/components/login/SignOutButton";
import Link from "next/link";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-gray-900"
                        >
                            NextAuth App
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <span className="text-gray-700 text-sm">
                                    Olá,{" "}
                                    {session.user?.name || session.user?.email}
                                </span>
                                <SignOutButton />
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
