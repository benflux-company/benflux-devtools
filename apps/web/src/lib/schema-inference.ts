export type FieldFormat = "date-time" | "uuid" | "email";

export type InferredType =
  | { kind: "string"; formats: FieldFormat[]; literals: string[] | null }
  | { kind: "number"; isInteger: boolean }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "unknown" }
  | { kind: "array"; items: InferredType[] }
  | { kind: "object"; fields: InferredField[] };

export interface InferredField {
  key: string;
  optional: boolean;
  types: InferredType[];
}

const ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function detectFormat(values: string[]): FieldFormat | null {
  if (values.length === 0) return null;
  if (values.every((v) => ISO_DATE_TIME_RE.test(v))) return "date-time";
  if (values.every((v) => UUID_RE.test(v))) return "uuid";
  if (values.every((v) => EMAIL_RE.test(v))) return "email";
  return null;
}

function detectLiterals(values: string[]): string[] | null {
  const distinct = Array.from(new Set(values));
  const hasRepeats = distinct.length < values.length;
  if (hasRepeats && distinct.length >= 2 && distinct.length <= 6) {
    return distinct.sort();
  }
  return null;
}

function inferString(samples: string[]): InferredType {
  const format = detectFormat(samples);
  const literals = format ? null : detectLiterals(samples);
  return { kind: "string", formats: format ? [format] : [], literals };
}

function inferNumber(samples: number[]): InferredType {
  return { kind: "number", isInteger: samples.every((n) => Number.isInteger(n)) };
}

function inferObject(samples: Record<string, unknown>[]): InferredType {
  const allKeys = new Set<string>();
  for (const sample of samples) {
    for (const key of Object.keys(sample)) allKeys.add(key);
  }

  const fields: InferredField[] = Array.from(allKeys).map((key) => {
    const present = samples.filter((s) => Object.prototype.hasOwnProperty.call(s, key));
    const values = present.map((s) => s[key]);
    return {
      key,
      optional: present.length < samples.length,
      types: inferTypes(values),
    };
  });

  return { kind: "object", fields };
}

function inferArray(samples: unknown[][]): InferredType {
  const items = samples.flat();
  return { kind: "array", items: inferTypes(items) };
}

/** Infers the set of variant types observed across every sample value at a given path. */
export function inferTypes(samples: unknown[]): InferredType[] {
  const strings: string[] = [];
  const numbers: number[] = [];
  const booleans: boolean[] = [];
  const objects: Record<string, unknown>[] = [];
  const arrays: unknown[][] = [];
  let hasNull = false;

  for (const value of samples) {
    if (value === null || value === undefined) {
      hasNull = true;
    } else if (typeof value === "string") {
      strings.push(value);
    } else if (typeof value === "number") {
      numbers.push(value);
    } else if (typeof value === "boolean") {
      booleans.push(value);
    } else if (Array.isArray(value)) {
      arrays.push(value);
    } else if (typeof value === "object") {
      objects.push(value as Record<string, unknown>);
    }
  }

  const variants: InferredType[] = [];
  if (strings.length) variants.push(inferString(strings));
  if (numbers.length) variants.push(inferNumber(numbers));
  if (booleans.length) variants.push({ kind: "boolean" });
  if (objects.length) variants.push(inferObject(objects));
  if (arrays.length) variants.push(inferArray(arrays));
  if (hasNull) variants.push({ kind: "null" });

  if (variants.length === 0) return [{ kind: "unknown" }];
  return variants;
}

export function inferRoot(value: unknown): InferredType[] {
  return inferTypes([value]);
}
