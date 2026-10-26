import { SISTEMA_AUTOSERVICO, SQUADS_VALIDAS } from "@/const";

const SQUADS = new Set(SQUADS_VALIDAS);

const ehSquadValida = (nome: string) => SQUADS.has(nome.toUpperCase());

/**
 * Valida se o usuário possui acesso ao sistema baseado nos grupos do Keycloak.
 * O usuário deve pertencer a pelo menos uma squad válida.
 */
export function temPermissaoDeAcessoV2(groups: string[] = []): boolean {
    return (groups ?? []).some(ehSquadValida);
}

type PerfilPorSistema = {
    sistema: number;
    perfis: string[];
};

/**
 * Valida se o usuário possui perfil no sistema do Autosserviço com ao menos
 * uma squad válida.
 */
export function temPermissaoDeAcesso(perfisPorSistema: PerfilPorSistema[]): boolean {
    return (perfisPorSistema ?? []).some(
        (item) => item.sistema === SISTEMA_AUTOSERVICO && item.perfis.some(ehSquadValida)
    );
}
