export type LoginResponse = {
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
    status?: number;
    detail?: string;
    operation_id?: string;
};

export type AuthCredentials = {
    rf?: string;
    password?: string;
};

export interface JwtToken {
    name?: string;
    email?: string;
    id?: string;
    rf?: string;
    cpf?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: { sistema: number; perfis: string[] }[];
}

interface SessionUser {
            name?: string;
            email?: string;
            id?: string;
            rf?: string;
            cpf?: string;
            situacaoUsuario?: number;
            situacaoGrupo?: number;
            visoes?: string[];
            perfis_por_sistema?: { sistema: number; perfis: string[] }[];
        }

export interface Session {
    user: SessionUser;
}

export interface Token {
    id?: string;
    rf?: string;
    cpf?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: {
        sistema: number;
        perfis: string[];
    }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    rf: string;
    cpf: string;
    situacaoUsuario: number;
    situacaoGrupo: number;
    visoes: string[];
    perfis_por_sistema: {
        sistema: number;
        perfis: string[];
    }[];
}
