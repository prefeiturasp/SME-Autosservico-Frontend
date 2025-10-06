import { autenticaCoreSSO, autenticaKeycloak } from "@/lib/axios";
import { AxiosError } from "axios";
import { LoginData, LoginResponse } from "@/types/login";
import { decodeJwt } from "../../utils";

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

export async function loginKeycloak(data: LoginData): Promise<LoginResponse> {
    // Parâmetros fixos ou de env
    const clientId = process.env.KEYCLOAK_CLIENT_ID ?? "nome-do-projeto";
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? "secret-key";
    const grantType = process.env.KEYCLOAK_GRANT_TYPE ?? "password";
    const realm = process.env.KEYCLOAK_REALM ?? "SQUAD";
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

        const keycloakResponse = await autenticaKeycloak.post(`/realms/${realm}/protocol/openid-connect/token`, dataKeycloak, { headers: headersKeycloak });
        // Decodifica o payload do token se necessário
        const accessToken = keycloakResponse.data.access_token;
        const payloadJson = decodeJwt(accessToken);
        // Retorne o que for necessário para o LoginResponse
        return {
            ...payloadJson,
            keycloakToken: accessToken,
        };
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
