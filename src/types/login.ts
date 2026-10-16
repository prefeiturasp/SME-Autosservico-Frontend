export type LoginData = {
    login: string;
    senha: string;
};

export type LoginResponse = {
    // Campos de erro (presentes quando há falha)
    status?: number;
    detail?: string;
    operation_id?: string;
    // Dados do usuário (presentes quando login é bem-sucedido)
    nome?: string;
    cpf?: string;
    email?: string;
    login?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: {
        sistema: number;
        perfis: string[];
    }[];
    // Para v2 (Keycloak)
    keycloakToken?: string;
    name?: string;
    groups?: string[];
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    cargo?: string;
    coordenadoria?: string;
    ultimo_acesso?: string;
    tempo_sessao?: string;
};
