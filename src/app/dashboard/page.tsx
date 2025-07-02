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
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <h2 className="text-2xl font-bold">Dados da Sessão</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">
                            Informações Básicas
                        </h2>
                        <p>
                            <strong>Nome:</strong> {session.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {session.user.email}
                        </p>
                        <p>
                            <strong>RF:</strong> {session.user.rf}
                        </p>
                        <p>
                            <strong>CPF:</strong> {session.user.cpf}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Status</h2>
                        <p>
                            <strong>Situação Usuário:</strong>{" "}
                            {session.user.situacaoUsuario}
                        </p>
                        <p>
                            <strong>Situação Grupo:</strong>{" "}
                            {session.user.situacaoGrupo}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Visões</h2>
                    <div className="flex flex-wrap gap-2">
                        {session.user.visoes?.map((visao) => (
                            <span
                                key={visao}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
                            >
                                {visao}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">
                        Perfis por Sistema
                    </h2>
                    <div className="space-y-3">
                        {session.user.perfis_por_sistema?.map((sistema) => (
                            <div
                                key={sistema.sistema}
                                className="border border-gray-200 rounded p-3"
                            >
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Sistema {sistema.sistema}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {sistema.perfis.map((perfil, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                                        >
                                            {perfil}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
