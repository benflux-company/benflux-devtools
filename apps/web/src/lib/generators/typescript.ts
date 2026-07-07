import type { InferredType } from "../schema-inference";

export interface TypeScriptOptions {
  rootName: string;
  useType: boolean;
  readonly: boolean;
  exportDeclarations: boolean;
}

export const defaultTypeScriptOptions: TypeScriptOptions = {
  rootName: "Root",
  useType: false,
  readonly: false,
  exportDeclarations: true,
};

function toPascalCase(key: string): string {
  const cleaned = key.replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""));
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /^[0-9]/.test(capitalized) ? `_${capitalized}` : capitalized || "Field";
}

interface Ctx {
  declarations: string[];
  usedNames: Set<string>;
  options: TypeScriptOptions;
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

function literalUnion(literals: string[]): string {
  return literals.map((l) => JSON.stringify(l)).join(" | ");
}

function primitiveType(type: InferredType): string {
  switch (type.kind) {
    case "string":
      return type.literals ? literalUnion(type.literals) : "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "unknown":
      return "unknown";
    default:
      return "unknown";
  }
}

function emitObject(fields: { key: string; optional: boolean; typeExpr: string }[], ctx: Ctx): string {
  const modifier = ctx.options.readonly ? "readonly " : "";
  const lines = fields.map((f) => `  ${modifier}${f.key}${f.optional ? "?" : ""}: ${f.typeExpr};`);
  return `{\n${lines.join("\n")}\n}`;
}

function declare(name: string, body: string, ctx: Ctx): void {
  const exportKw = ctx.options.exportDeclarations ? "export " : "";
  if (ctx.options.useType) {
    ctx.declarations.push(`${exportKw}type ${name} = ${body};`);
  } else {
    ctx.declarations.push(`${exportKw}interface ${name} ${body}`);
  }
}

/** Resolves the inline TS type expression for a field's variant types, hoisting object/array-of-object shapes as named declarations. */
function typeExprForVariants(types: InferredType[], nameHint: string, ctx: Ctx): string {
  const parts = types.map((type) => {
    if (type.kind === "object") {
      const name = uniqueName(toPascalCase(nameHint), ctx);
      const fields = type.fields.map((f) => ({
        key: f.key,
        optional: f.optional,
        typeExpr: typeExprForVariants(f.types, f.key, ctx),
      }));
      declare(name, emitObject(fields, ctx), ctx);
      return name;
    }
    if (type.kind === "array") {
      const itemExpr = typeExprForVariants(type.items, singularize(nameHint), ctx);
      return itemExpr.includes(" | ") ? `(${itemExpr})[]` : `${itemExpr}[]`;
    }
    return primitiveType(type);
  });
  return Array.from(new Set(parts)).join(" | ") || "unknown";
}

function singularize(name: string): string {
  return name.endsWith("s") && !name.endsWith("ss") ? name.slice(0, -1) : name;
}

export function generateTypeScript(root: InferredType[], options: Partial<TypeScriptOptions> = {}): string {
  const opts: TypeScriptOptions = { ...defaultTypeScriptOptions, ...options };
  const ctx: Ctx = { declarations: [], usedNames: new Set(), options: opts };
  const exportKw = opts.exportDeclarations ? "export " : "";

  const rootObject = root.find((t) => t.kind === "object");
  let rootDecl: string;

  // Reserve the root's name up front so a nested type can never collide with it
  // (the nested one gets renamed instead, since it's resolved second).
  ctx.usedNames.add(opts.rootName);

  if (rootObject && rootObject.kind === "object") {
    // Computing field expressions may hoist nested object types into
    // ctx.declarations before the root's own declaration is built below.
    const fields = rootObject.fields.map((f) => ({
      key: f.key,
      optional: f.optional,
      typeExpr: typeExprForVariants(f.types, f.key, ctx),
    }));
    const body = emitObject(fields, ctx);
    rootDecl = opts.useType
      ? `${exportKw}type ${opts.rootName} = ${body};`
      : `${exportKw}interface ${opts.rootName} ${body}`;
  } else {
    const expr = typeExprForVariants(root, opts.rootName, ctx);
    rootDecl = `${exportKw}type ${opts.rootName} = ${expr};`;
  }

  // Root declaration first, followed by any hoisted nested declarations in encounter order.
  return [rootDecl, ...ctx.declarations].join("\n\n");
}
