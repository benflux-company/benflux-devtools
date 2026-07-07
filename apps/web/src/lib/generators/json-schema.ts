import type { InferredType } from "../schema-inference";

export interface JsonSchemaOptions {
  title: string;
}

export const defaultJsonSchemaOptions: JsonSchemaOptions = {
  title: "Root",
};

type SchemaNode = Record<string, unknown>;

function typeSchema(type: InferredType): SchemaNode {
  switch (type.kind) {
    case "string": {
      const node: SchemaNode = { type: "string" };
      if (type.literals) node.enum = type.literals;
      else if (type.formats[0]) node.format = type.formats[0];
      return node;
    }
    case "number":
      return { type: type.isInteger ? "integer" : "number" };
    case "boolean":
      return { type: "boolean" };
    case "null":
      return { type: "null" };
    case "unknown":
      return {};
    case "array":
      return { type: "array", items: schemaForVariants(type.items) };
    case "object": {
      const properties: Record<string, SchemaNode> = {};
      const required: string[] = [];
      for (const field of type.fields) {
        properties[field.key] = schemaForVariants(field.types);
        if (!field.optional) required.push(field.key);
      }
      const node: SchemaNode = { type: "object", properties };
      if (required.length) node.required = required;
      return node;
    }
    default:
      return {};
  }
}

function schemaForVariants(types: InferredType[]): SchemaNode {
  const nonNull = types.filter((t) => t.kind !== "null");
  const hasNull = types.some((t) => t.kind === "null");

  if (nonNull.length === 0) return hasNull ? { type: "null" } : {};

  if (nonNull.length === 1) {
    const node = typeSchema(nonNull[0]);
    if (hasNull && typeof node.type === "string") {
      node.type = [node.type, "null"];
    }
    return node;
  }

  const variants = nonNull.map(typeSchema);
  if (hasNull) variants.push({ type: "null" });
  return { anyOf: variants };
}

export function generateJsonSchema(root: InferredType[], options: Partial<JsonSchemaOptions> = {}): string {
  const opts: JsonSchemaOptions = { ...defaultJsonSchemaOptions, ...options };
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: opts.title,
    ...schemaForVariants(root),
  };
  return JSON.stringify(schema, null, 2);
}
