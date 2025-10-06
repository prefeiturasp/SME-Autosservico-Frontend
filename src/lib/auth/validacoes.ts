/**
 * Valida se o usuário possui acesso ao sistema baseado nos grupos do Keycloak.
 * O usuário deve pertencer a pelo menos um grupo válido.
 */
export function temPermissaoDeAcessoV2(
    groups: string[] = [],
    gruposValidosEnv = process.env.NEXT_PUBLIC_SQUADS_VALIDAS
): boolean {
    if (!gruposValidosEnv) {
        console.warn("Variável de ambiente NEXT_PUBLIC_SQUADS_VALIDAS não configurada.");
        return false;
    }
    const gruposValidos = gruposValidosEnv.split(",").map((g) => g.trim().toUpperCase());
    console.log("Grupos do usuário:", groups);
    console.log("Grupos válidos:", gruposValidos);
    return groups.some((group) => gruposValidos.includes(group.toUpperCase()));
}
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

    return perfisPorSistema?.some(
        (item) =>
            item.sistema === sistema &&
            item.perfis.some((perfil) => squadsValidas.includes(perfil.toUpperCase()))
    );
}
