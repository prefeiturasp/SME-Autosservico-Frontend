import type { WorkItem } from "@/types/backlog";

/**
 * Normaliza texto removendo acentos, convertendo para maiúsculas e removendo espaços extras
 */
export function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
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
    const withoutSpaces = normalized.replace(/\s+/g, "");
    const withHyphens = normalized.replace(/\s+/g, "-");

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
    const bracketRegex = /\[([^\]]+)\]/g;
    let bracketMatch: RegExpExecArray | null;
    while ((bracketMatch = bracketRegex.exec(normalizedTitle)) !== null) {
        const content = bracketMatch[1].trim();
        if (content) identifiers.push(content);
    }

    // Também considera o início do título antes de ":" ou "-" como possível identificador
    // Ex: "SGP - Erro no login" ou "SIGPAE: Problema no cadastro"
    const prefixRegex = /^([A-Z0-9\s-]+?)\s*[-:]/;
    const prefixMatch = prefixRegex.exec(normalizedTitle);
    if (prefixMatch) {
        const prefix = prefixMatch[1].trim();
        if (prefix.length >= 2 && prefix.length <= 30) {
            identifiers.push(prefix);
            identifiers.push(prefix.replace(/\s+/g, ""));
            identifiers.push(prefix.replace(/\s+/g, "-"));
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
    const clean1 = id1.replace(/[-\s]/g, "");
    const clean2 = id2.replace(/[-\s]/g, "");
    if (clean1 === clean2) return true;
    if (clean1.includes(clean2) || clean2.includes(clean1)) return true;

    return false;
}

/**
 * Verifica se um bug pertence a um projeto baseado no título e tags
 */
export function matchesBugToProject(bug: WorkItem, projectIdentifiers: string[]): boolean {
    const bugTags = parseTags(bug.tags);
    const titleIdentifiers = extractTitleIdentifiers(bug.title);

    // Combina tags e identificadores do título
    const allBugIdentifiers = [...bugTags, ...titleIdentifiers];

    // Se o bug não tem nenhum identificador, não faz match
    if (allBugIdentifiers.length === 0) return false;

    // Verifica se algum identificador do projeto faz match com algum identificador do bug
    return projectIdentifiers.some((projectId) =>
        allBugIdentifiers.some((bugId) => identifiersMatch(projectId, bugId))
    );
}
