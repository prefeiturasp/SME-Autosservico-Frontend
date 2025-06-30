import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();

    if (!session) {
        redirect("/login");
        return null;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Dashboard
                            </h1>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h2 className="text-lg font-medium text-blue-900 mb-2">
                                    Informações da Sessão
                                </h2>
                                <div className="space-y-2 text-sm text-blue-800">
                                    <p>
                                        <strong>ID:</strong> {session.user?.id}
                                    </p>
                                    <p>
                                        <strong>RF:</strong> {session.user?.rf}
                                    </p>
                                    <p>
                                        <strong>Nome:</strong>{" "}
                                        {session.user?.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {session.user?.email}
                                    </p>
                                    <p>
                                        <strong>Imagem:</strong>{" "}
                                        {session.user?.image || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Abrangência Nome:</strong>{" "}
                                        {session.user?.abrangencia?.nome}
                                    </p>
                                    <p>
                                        <strong>Abrangência Descrição:</strong>{" "}
                                        {session.user?.abrangencia?.descricao}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">
                                    Área Protegida
                                </h3>
                                <p className="text-gray-600">
                                    Este conteúdo só é visível para usuários
                                    autenticados. Você está vendo isso porque
                                    fez login com sucesso!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
