import type { WorkItem } from "@/types/backlog";

/**
 * Normaliza texto removendo acentos, convertendo para maiúsculas e removendo espaços extras
 */
export function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

/**
 * Mapeamento de nome do projeto para identificadores usados em tags/títulos.
 * Os identificadores devem estar normalizados (sem acentos, maiúsculas).
 */
export const PROJECT_IDENTIFIERS: Record<string, string[]> = {
    "Portal Educação": ["PORTAL EDUCACAO", "EDUCACAO", "PORTAL-EDUCACAO"],
    "Portal CEU": ["PORTAL CEU", "CEU", "PORTAL-CEU"],
    "Plateia": ["PLATEIA"],
    "Plateia App": ["PLATEIA APP", "PLATEIA-APP", "PLATEIA"],
    "Intranet": ["INTRANET"],
    "Escolhas": ["ESCOLHAS"],
    "Sigla": ["SIGLA"],
    "SigPAE": ["SIGPAE", "SIG-PAE", "SIGPAE-API", "SIGPAE-FRONTEND"],
    "Rolê Agroecológico": ["ROLE AGROECOLOGICO", "ROLE-AGROECOLOGICO", "ROLE"],
    "Novo SGP": ["SGP", "NOVO SGP", "NOVO-SGP", "NOVOSGP"],
    "Serap": ["SERAP", "PROVA SERAP", "PROVA-SERAP"],
    "Serap Estudantes": ["SERAP ESTUDANTES", "SERAP-ESTUDANTES", "SERAP"],
    "Cdep": ["CDEP"],
    "Curriculo da Cidade": ["CURRICULO", "CURRICULO DA CIDADE", "CURRICULO-DA-CIDADE", "PLATAFORMA-CURRICULO"],
    "IDEP": ["IDEP", "INDICE-IDEP", "INDICE IDEP"],
    "Conecta Formação": ["CONECTA FORMACAO", "CONECTA-FORMACAO", "CONECTAFORMACAO"],
    "SigEscola": ["SIGESCOLA", "SIG-ESCOLA", "PTRF"],
    "Autosserviço": ["AUTOSSERVICO", "AUTO-SERVICO", "AUTOSERVICO"],
    "GIPE": ["GIPE"],
};

/**
 * Obtém os identificadores de um projeto.
 * Se não encontrar no mapeamento, gera identificadores a partir do nome do projeto.
 */
export function getProjectIdentifiers(projectName: string): string[] {
    const mapped = PROJECT_IDENTIFIERS[projectName];
    if (mapped) return mapped;

    // Fallback: gera identificadores a partir do nome do projeto
    const normalized = normalizeText(projectName);
    const withoutSpaces = normalized.replaceAll(/\s+/g, "");
    const withHyphens = normalized.replaceAll(/\s+/g, "-");

    return [normalized, withoutSpaces, withHyphens].filter(
        (v, i, arr) => arr.indexOf(v) === i
    );
}

/**
 * Parseia as tags de um bug (podem vir separadas por ; ou ,)
 */
export function parseTags(tags: string | null | undefined): string[] {
    if (!tags) return [];

    return tags
        .split(/[;,]/)
        .map((tag) => normalizeText(tag))
        .filter((tag) => tag.length > 0);
}

/**
 * Extrai o identificador do projeto do título do bug.
 * Procura por padrões como [SGP], [SIGPAE], etc.
 */
export function extractTitleIdentifiers(title: string): string[] {
    if (!title) return [];

    const normalizedTitle = normalizeText(title);
    const identifiers: string[] = [];

    // Extrai identificadores entre colchetes: [SGP], [SIGPAE], etc.
    // Limita a 100 caracteres para evitar ReDoS
    const bracketRegex = /\[([^\]]{1,100})\]/g;
    let bracketMatch: RegExpExecArray | null;
    while ((bracketMatch = bracketRegex.exec(normalizedTitle)) !== null) {
        const content = bracketMatch[1].trim();
        if (content) identifiers.push(content);
    }

    // Também considera o início do título antes de ":" ou "-" como possível identificador
    // Ex: "SGP - Erro no login" ou "SIGPAE: Problema no cadastro"
    // Limita a 30 caracteres para evitar ReDoS
    const prefixRegex = /^([A-Z0-9][A-Z0-9 -]{0,29})[-:]/;
    const prefixMatch = prefixRegex.exec(normalizedTitle);
    if (prefixMatch) {
        const prefix = prefixMatch[1].trim();
        if (prefix.length >= 2) {
            identifiers.push(prefix, prefix.replaceAll(/ +/g, ""), prefix.replaceAll(/ +/g, "-"));
        }
    }

    return identifiers;
}

/**
 * Verifica se dois identificadores fazem match (comparação flexível)
 */
export function identifiersMatch(id1: string, id2: string): boolean {
    if (id1 === id2) return true;

    // Verifica se um contém o outro (para casos como "SGP" matchando "NOVO SGP")
    if (id1.includes(id2) || id2.includes(id1)) return true;

    // Remove hífens e espaços para comparação
    const clean1 = id1.replaceAll(/[-\s]/g, "");
    const clean2 = id2.replaceAll(/[-\s]/g, "");
    if (clean1 === clean2) return true;
    if (clean1.includes(clean2) || clean2.includes(clean1)) return true;

    return false;
}

/**
 * Retorna todos os identificadores conhecidos de todos os projetos.
 */
function getAllKnownIdentifiers(): string[] {
    const allIdentifiers: string[] = [];
    for (const identifiers of Object.values(PROJECT_IDENTIFIERS)) {
        allIdentifiers.push(...identifiers);
    }
    return allIdentifiers;
}

/**
 * Verifica se o texto contém algum identificador de projeto conhecido.
 */
function containsAnyKnownIdentifier(searchText: string): boolean {
    const allIdentifiers = getAllKnownIdentifiers();
    const cleanSearchText = searchText.replaceAll(/[-\s]/g, "");

    return allIdentifiers.some((id) => {
        if (searchText.includes(id)) return true;
        const cleanId = id.replaceAll(/[-\s]/g, "");
        if (cleanSearchText.includes(cleanId)) return true;
        return false;
    });
}

/**
 * Verifica se um bug pertence a um projeto baseado no título e tags.
 * Busca os identificadores do projeto em qualquer lugar do título ou das tags.
 * Bugs sem identificadores conhecidos aparecem em todos os projetos.
 */
export function matchesBugToProject(bug: WorkItem, projectIdentifiers: string[]): boolean {
    const normalizedTitle = normalizeText(bug.title ?? "");
    const normalizedTags = normalizeText(bug.tags ?? "");

    // Combina título e tags para busca
    const searchText = `${normalizedTitle} ${normalizedTags}`;

    // Bugs sem título e sem tags aparecem em todos os projetos
    if (searchText.trim().length === 0) return true;

    // Se o bug não contém nenhum identificador conhecido, aparece em todos os projetos
    if (!containsAnyKnownIdentifier(searchText)) return true;

    // Verifica se algum identificador do projeto aparece no título ou nas tags
    const cleanSearchText = searchText.replaceAll(/[-\s]/g, "");
    return projectIdentifiers.some((projectId) => {
        // Busca exata do identificador
        if (searchText.includes(projectId)) return true;

        // Busca sem hífens e espaços
        const cleanProjectId = projectId.replaceAll(/[-\s]/g, "");
        if (cleanSearchText.includes(cleanProjectId)) return true;

        return false;
    });
}
