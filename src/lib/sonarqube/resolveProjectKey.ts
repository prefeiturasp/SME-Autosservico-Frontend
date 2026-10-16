import "server-only";
import { searchComponents, type SonarComponentSummary } from "./client";

type ResolveInput = {
  projectName: string;
  sonarProjectKey?: string;
  zabbixQueryJenkinsJob?: string;
};

const cache = new Map<string, string | null>();

function cacheKey(input: ResolveInput): string {
  return `${input.sonarProjectKey ?? ""}|${input.zabbixQueryJenkinsJob ?? ""}|${input.projectName}`;
}

function deriveBaseFromJenkinsJob(jenkinsJob?: string): string | null {
  if (!jenkinsJob) return null;
  const trimmed = jenkinsJob.trim();
  if (!trimmed) return null;
  const candidate = trimmed.split("/")[0];
  return candidate || null;
}

async function safeSearch(query: string): Promise<SonarComponentSummary[]> {
  try {
    const res = await searchComponents(query);
    return res.components;
  } catch {
    return [];
  }
}

function findExactKey(components: SonarComponentSummary[], key: string): string | null {
  return components.find((c) => c.key === key)?.key ?? null;
}

function pickBestMatch(
  components: SonarComponentSummary[],
  base: string,
): string | null {
  if (components.length === 0) return null;
  if (components.length === 1) return components[0].key;

  const lowerBase = base.toLowerCase();

  const sameBase = components.filter((c) =>
    c.key.toLowerCase().startsWith(lowerBase),
  );
  const pool = sameBase.length > 0 ? sameBase : components;

  const frontendMatch = pool.find((c) => /front|frontend|front-?end/i.test(c.key));
  if (frontendMatch) return frontendMatch.key;

  return pool[0].key;
}

export async function resolveProjectKey(input: ResolveInput): Promise<string | null> {
  const key = cacheKey(input);
  if (cache.has(key)) return cache.get(key) ?? null;

  if (input.sonarProjectKey) {
    const components = await safeSearch(input.sonarProjectKey);
    const exact = findExactKey(components, input.sonarProjectKey);
    if (exact) {
      cache.set(key, exact);
      return exact;
    }
  }

  const base = deriveBaseFromJenkinsJob(input.zabbixQueryJenkinsJob);
  if (base) {
    const components = await safeSearch(base);
    const exact = findExactKey(components, base);
    if (exact) {
      cache.set(key, exact);
      return exact;
    }
    const best = pickBestMatch(components, base);
    if (best) {
      cache.set(key, best);
      return best;
    }
  }

  if (input.projectName) {
    const components = await safeSearch(input.projectName);
    const best = pickBestMatch(components, input.projectName);
    if (best) {
      cache.set(key, best);
      return best;
    }
  }

  cache.set(key, null);
  return null;
}

export function clearResolveProjectKeyCache(): void {
  cache.clear();
}

export const __test__ = { pickBestMatch, deriveBaseFromJenkinsJob };
