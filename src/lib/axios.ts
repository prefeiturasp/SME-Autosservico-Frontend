import axios from "axios";

export const autenticaCoreSSO = axios.create({
  baseURL: process.env.AUTENTICA_CORESSO_API_URL,
});

export const autenticaKeycloak = axios.create({
  baseURL: process.env.KEYCLOAK_URL,
});

