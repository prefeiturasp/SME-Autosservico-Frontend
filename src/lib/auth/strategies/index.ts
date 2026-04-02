import { autenticaCoreSSO, autenticaKeycloak } from "@/lib/axios";
import { AxiosError } from "axios";
import { LoginData, LoginResponse } from "@/types/login";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export async function loginCoreSSO(data: LoginData): Promise<LoginResponse> {
    if (!process.env.AUTENTICA_CORESSO_API_URL) {
        throw new Error("AUTENTICA_CORESSO_API_URL não está definida");
    }
    if (!process.env.AUTENTICA_CORESSO_API_TOKEN) {
        throw new Error("AUTENTICA_CORESSO_API_TOKEN não está definida");
    }
    const token = process.env.AUTENTICA_CORESSO_API_TOKEN;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
    };
    try {
        const response = await autenticaCoreSSO.post("/autenticacao/", data, { headers });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError && e.response) {
            return {
                status: e.response.status,
                detail: e.response.data.detail,
                operation_id: e.response.data.operation_id,
            };
        }
        throw e;
    }
}

async function verifyKeycloakJwt(
    token: string,
    keycloakUrl: string,
    realm: string,
): Promise<JWTPayload> {
    const jwksUrl = new URL(
        `/realms/${realm}/protocol/openid-connect/certs`,
        keycloakUrl,
    );
    const jwks = createRemoteJWKSet(jwksUrl);
    const { payload } = await jwtVerify(token, jwks);
    return payload;
}

export async function loginKeycloak(data: LoginData): Promise<LoginResponse> {
    if (!process.env.KEYCLOAK_URL) {
        throw new Error("KEYCLOAK_URL não está definida");
    }
    if (!process.env.KEYCLOAK_CLIENT_ID) {
        throw new Error("KEYCLOAK_CLIENT_ID não está definida");
    }
    if (!process.env.KEYCLOAK_CLIENT_SECRET) {
        throw new Error("KEYCLOAK_CLIENT_SECRET não está definida");
    }
    if (!process.env.KEYCLOAK_REALM) {
        throw new Error("KEYCLOAK_REALM não está definida");
    }

    const keycloakUrl = process.env.KEYCLOAK_URL;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const grantType = process.env.KEYCLOAK_GRANT_TYPE ?? "password";
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
    const realm = process.env.KEYCLOAK_REALM;
    const password = data.senha;
    const username = data.login;

    const dataKeycloak = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
        username,
        password,
    });

    try {
        const headersKeycloak = {
            "Content-Type": "application/x-www-form-urlencoded",
        };

        const keycloakResponse = await autenticaKeycloak.post(
            `/realms/${realm}/protocol/openid-connect/token`,
            dataKeycloak,
            { headers: headersKeycloak },
        );

        const accessToken = keycloakResponse.data.access_token;
        const payload = await verifyKeycloakJwt(accessToken, keycloakUrl, realm);

        return {
            ...payload,
            keycloakToken: accessToken,
        } as LoginResponse;
    } catch (e) {
        if (e instanceof AxiosError && e.response) {
            return {
                status: e.response.status,
                detail: e.response.data.error_description ?? e.response.data.detail,
                operation_id: e.response.data.operation_id,
            };
        }
        throw e;
    }
}
