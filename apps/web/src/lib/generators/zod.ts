import type { InferredType } from "../schema-inference";

export interface ZodOptions {
  rootName: string;
  exportType: boolean;
}

export const defaultZodOptions: ZodOptions = {
  rootName: "Root",
  exportType: true,
};

function toPascalCase(key: string): string {
  const cleaned = key.replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""));
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /^[0-9]/.test(capitalized) ? `_${capitalized}` : capitalized || "Field";
}

function singularize(name: string): string {
  return name.endsWith("s") && !name.endsWith("ss") ? name.slice(0, -1) : name;
}

interface Ctx {
  declarations: string[];
  usedNames: Set<string>;
}

function uniqueName(preferred: string, ctx: Ctx): string {
  if (!ctx.usedNames.has(preferred)) {
    ctx.usedNames.add(preferred);
    return preferred;
  }
  let i = 2;
  while (ctx.usedNames.has(`${preferred}${i}`)) i++;
  const name = `${preferred}${i}`;
  ctx.usedNames.add(name);
  return name;
}

function primitiveExpr(type: InferredType): string {
  switch (type.kind) {
    case "string": {
      if (type.literals) return `z.enum([${type.literals.map((l) => JSON.stringify(l)).join(", ")}])`;
      let expr = "z.string()";
      if (type.formats.includes("date-time")) expr += ".datetime()";
      if (type.formats.includes("uuid")) expr += ".uuid()";
      if (type.formats.includes("email")) expr += ".email()";
      return expr;
    }
    case "number":
      return type.isInteger ? "z.number().int()" : "z.number()";
    case "boolean":
      return "z.boolean()";
    case "null":
      return "z.null()";
    case "unknown":
      return "z.unknown()";
    default:
      return "z.unknown()";
  }
}

function objectExpr(fields: { key: string; optional: boolean; expr: string }[]): string {
  const lines = fields.map((f) => `  ${JSON.stringify(f.key)}: ${f.expr}${f.optional ? ".optional()" : ""},`);
  return `z.object({\n${lines.join("\n")}\n})`;
}

function objectFieldsExpr(type: Extract<InferredType, { kind: "object" }>, ctx: Ctx): string {
  const fields = type.fields.map((f) => ({
    key: f.key,
    optional: f.optional,
    expr: exprForVariants(f.types, f.key, ctx),
  }));
  return objectExpr(fields);
}

function exprForVariants(types: InferredType[], nameHint: string, ctx: Ctx): string {
  const nonNull = types.filter((t) => t.kind !== "null");
  const hasNull = types.some((t) => t.kind === "null");

  if (nonNull.length === 0) return "z.null()";

  const parts = nonNull.map((type) => {
    if (type.kind === "object") {
      const name = uniqueName(`${toPascalCase(nameHint)}Schema`, ctx);
      ctx.declarations.push(`const ${name} = ${objectFieldsExpr(type, ctx)};`);
      return name;
    }
    if (type.kind === "array") {
      const itemExpr = exprForVariants(type.items, singularize(nameHint), ctx);
      return `z.array(${itemExpr})`;
    }
    return primitiveExpr(type);
  });

  const unique = Array.from(new Set(parts));
  const base = unique.length === 1 ? unique[0] : `z.union([${unique.join(", ")}])`;
  return hasNull ? `${base}.nullable()` : base;
}

export function generateZod(root: InferredType[], options: Partial<ZodOptions> = {}): string {
  const opts: ZodOptions = { ...defaultZodOptions, ...options };
  const ctx: Ctx = { declarations: [], usedNames: new Set() };
  const rootSchemaName = `${opts.rootName}Schema`;
  ctx.usedNames.add(rootSchemaName);

  // Special-case an object root so its fields become the root schema directly,
  // instead of going through the generic hoist path (which would otherwise
  // reserve "<Root>Schema" for a nested const and alias RootSchema to it).
  const rootObject = root.find((t): t is Extract<InferredType, { kind: "object" }> => t.kind === "object");
  const rootExpr = rootObject ? objectFieldsExpr(rootObject, ctx) : exprForVariants(root, opts.rootName, ctx);

  const lines = ['import { z } from "zod";', "", ...ctx.declarations];
  if (ctx.declarations.length) lines.push("");
  lines.push(`export const ${rootSchemaName} = ${rootExpr};`);
  if (opts.exportType) {
    lines.push("", `export type ${opts.rootName} = z.infer<typeof ${rootSchemaName}>;`);
  }
  return lines.join("\n");
}
