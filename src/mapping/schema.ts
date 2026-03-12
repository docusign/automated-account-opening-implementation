import { KeyValuePair } from "../utils/mapping";

type ExactRule = {
  kind: "exact";
  from: string;
  to: string;
  required?: boolean;
  default?: unknown;
  map?: (v: string) => unknown;
};

type RegexRule = {
  kind: "regex";
  from: RegExp;
  to: (m: RegExpMatchArray) => string;
  map?: (v: string, m: RegExpMatchArray) => unknown;
};

export type Rule = ExactRule | RegexRule;

export type Schema<TOutput extends object> = {
  name: string;
  rules: readonly Rule[];
  validate?: (out: TOutput, src: Record<string, string>) => string[];
};

type PathToken = string | number;

function parsePath(path: string): PathToken[] {
  // "individual.identification[0].id" -> ["individual", "identification", 0, "id"]
  const tokens: PathToken[] = [];

  for (const segment of path.split(".")) {
    const re = /([^[\]]+)|\[(\d+)\]/g;
    let match: RegExpExecArray | null;

    while ((match = re.exec(segment)) !== null) {
      if (match[1] !== undefined) {
        tokens.push(match[1]); // property name
      } else if (match[2] !== undefined) {
        tokens.push(Number(match[2])); // array index
      }
    }
  }

  return tokens;
}

export function anyProvided(src: Record<string, string>, keys: readonly string[]): boolean {
  return keys.some(k => {
    const v = src[k];
    return v !== undefined && v !== null && String(v).trim() !== "";
  });
}

export function missingRequired(src: Record<string, string>, required: readonly string[]): string[] {
  const missing: string[] = [];
  for (const k of required) {
    const v = src[k];
    if (v === undefined || v === null || String(v).trim() === "") missing.push(k);
  }
  return missing;
}

export function setByPath(obj: Record<string, any>, path: string, value: unknown): void {
  const tokens = parsePath(path);
  if (!tokens.length) return;

  let current: any = obj;

  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (typeof token === "string") {
      // Accessing an object property: current[token]
      if (current[token] === undefined) {
        // Create [] if next token is an array index, otherwise {}
        current[token] = typeof nextToken === "number" ? [] : {};
      } else {
        if (typeof nextToken === "number" && !Array.isArray(current[token])) {
          // If path expects an array but existing value is not array
          current[token] = [];
        } else if (typeof nextToken === "string" && (typeof current[token] !== "object" || current[token] === null)) {
          current[token] = {};
        }
      }

      current = current[token];
    } else {
      // token is number - current must be an array
      if (!Array.isArray(current)) {
        throw new Error(`Invalid path "${path}": expected array before index [${token}]`);
      }

      if (current[token] === undefined) {
        current[token] = typeof nextToken === "number" ? [] : {};
      } else {
        if (typeof nextToken === "number" && !Array.isArray(current[token])) {
          current[token] = [];
        } else if (typeof nextToken === "string" && (typeof current[token] !== "object" || current[token] === null)) {
          current[token] = {};
        }
      }

      current = current[token];
    }
  }

  const lastToken = tokens[tokens.length - 1];

  if (typeof lastToken === "string") {
    if (lastToken.toLowerCase().includes("date")) {
      value = dateToNumber(value as string);
    }

    current[lastToken] = value;
  } else {
    if (!Array.isArray(current)) {
      throw new Error(`Invalid path "${path}": expected array for final index [${lastToken}]`);
    }
    current[lastToken] = value;
  }
}

export function pairsToDict(pairs: readonly KeyValuePair[]): Record<string, string> {
  const dict: Record<string, string> = {};
  for (const p of pairs) dict[p.key] = p.value;
  return dict;
}

export function dateToNumber(s: string): number | null {
  const m = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(s);
  if (!m) return null;
  return Number(m[1] + m[2] + m[3]);
}

export function mapWithSchema<TOutput extends object>(
  pairs: readonly KeyValuePair[],
  schema: Schema<TOutput>
): TOutput {
  const dict = pairsToDict(pairs);
  const out: any = {};
  const errors: string[] = [];

  for (const rule of schema.rules) {
    if (rule.kind === "exact") {
      const raw = dict[rule.from];

      if (raw === undefined || raw === null || raw === "") {
        if (rule.required) errors.push(`Missing required key "${rule.from}"`);
        if (rule.default !== undefined) setByPath(out, rule.to, rule.default);
        continue;
      }

      const value = rule.map ? rule.map(raw) : raw;
      setByPath(out, rule.to, value);
      continue;
    }

    // regex rules: apply to all keys that match
    for (const [k, v] of Object.entries(dict)) {
      const m = k.match(rule.from);
      if (!m) continue;

      const targetPath = rule.to(m);
      const value = rule.map ? rule.map(v, m) : v;
      setByPath(out, targetPath, value);
    }
  }

  if (schema.validate) {
    errors.push(...schema.validate(out as TOutput, dict));
  }

  if (errors.length) {
    throw new Error(`Schema "${schema.name}" mapping failed:\n- ${errors.join("\n- ")}`);
  }

  return out as TOutput;
}
