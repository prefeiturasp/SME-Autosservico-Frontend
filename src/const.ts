// REGEX
export const PASSWORD_REGEX_PATTERN =
    /^[^ÁáÂâÀàÅåÃãÄäÉéÊêÈèËëÍíÎîÌìÏïÓóÔôÒòÕõÖöÚúÛûÙùÜüÇçÑñÝý]*$/;

// ACESSO
// Sistema do Autosserviço no CoreSSO e squads (coordenadorias) que podem entrar.
// Fixos no código: como variáveis NEXT_PUBLIC_*, dependiam do build de cada ambiente.
export const SISTEMA_AUTOSERVICO = 1008;
export const SQUADS_VALIDAS: readonly string[] = [
    "ASCOM",
    "CODAE",
    "COGEP",
    "COPED",
    "COPLAN",
    "COSERV",
    "COTIC",
    "EMFORPEF",
    "GIPE",
];

// VALIDATION MESSAGE
export const PASSWORD_ERROR_MESSAGE = "Senha é obrigatória";
export const RF_ERROR_MESSAGE = "RF ou CPF é obrigatório";
export const RF_FORMAT_ERROR_MESSAGE = "Formato de RF ou CPF inválido";
export const PERFIL_NOT_FOUND_ERROR_MESSAGE = "Não encontramos um perfil com essas informações. Por favor, tente novamente.";
export const PERFIL_NOT_PERMISSION_ERROR_MESSAGE = "Desculpe! mas o acesso ao Autosserviço é restrito a perfis específicos.";
