type PerfilPorSistema = {
    sistema: number;
    perfis: string[];
};

/**
 * Valida se o usuário possui acesso ao sistema e ao menos uma Squad válida.
 */
export function temPermissaoDeAcesso(
    perfisPorSistema: PerfilPorSistema[],
    sistemaEnv = process.env.NEXT_PUBLIC_SISTEMA_AUTOSERVICO,
    squadsEnv = process.env.NEXT_PUBLIC_SQUADS_VALIDAS
): boolean {

    if (!sistemaEnv || !squadsEnv) {
        console.warn("Variáveis de ambiente de acesso não configuradas corretamente.");
        return false;
    }

    const sistema = Number(sistemaEnv);
    const squadsValidas = squadsEnv.split(",").map((s) => s.trim().toUpperCase());

    console.log("Sistema esperado:", sistema, "Squads válidas:", squadsValidas);

    return perfisPorSistema?.some(
        (item) =>
            item.sistema === sistema &&
            item.perfis.some((perfil) => squadsValidas.includes(perfil.toUpperCase()))
    );
}
