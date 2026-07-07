export interface ConverterEntry {
  id: string;
  category: string;
  from: string;
  to: string;
  href?: string;
}

function entry(category: string, from: string, to: string, href?: string): ConverterEntry {
  return { id: `${category}-${from}-${to}`.toLowerCase().replace(/\s+/g, "-"), category, from, to, href };
}

const JSON_TO_TYPES_HREF = "/tools/json-to-types";
const JSON_YAML_HREF = "/tools/json-yaml";
const JSON_TOML_HREF = "/tools/json-toml";
const XML_TO_JSON_HREF = "/tools/xml-to-json";

export const converters: ConverterEntry[] = [
  // SVG
  entry("SVG", "SVG", "JSX"),
  entry("SVG", "SVG", "React Native"),

  // HTML
  entry("HTML", "HTML", "JSX"),
  entry("HTML", "HTML", "Pug"),

  // JSON
  entry("JSON", "JSON", "BigQuery Schema"),
  entry("JSON", "JSON", "Flow"),
  entry("JSON", "JSON", "Go Bson"),
  entry("JSON", "JSON", "Go Struct"),
  entry("JSON", "JSON", "GraphQL"),
  entry("JSON", "JSON", "io-ts"),
  entry("JSON", "JSON", "Java"),
  entry("JSON", "JSON", "JSDoc"),
  entry("JSON", "JSON", "JSON Schema", JSON_TO_TYPES_HREF),
  entry("JSON", "JSON", "Kotlin"),
  entry("JSON", "JSON", "MobX-State-Tree Model"),
  entry("JSON", "JSON", "Mongoose Schema"),
  entry("JSON", "JSON", "MySQL"),
  entry("JSON", "JSON", "React PropTypes"),
  entry("JSON", "JSON", "Rust Serde"),
  entry("JSON", "JSON", "Sarcastic"),
  entry("JSON", "JSON", "Scala Case Class"),
  entry("JSON", "JSON", "TOML", JSON_TOML_HREF),
  entry("JSON", "JSON", "TypeScript", JSON_TO_TYPES_HREF),
  entry("JSON", "JSON", "YAML", JSON_YAML_HREF),
  entry("JSON", "JSON", "Zod Schema", JSON_TO_TYPES_HREF),

  // JSON Schema
  entry("JSON Schema", "JSON Schema", "OpenAPI Schema"),
  entry("JSON Schema", "JSON Schema", "Protobuf"),
  entry("JSON Schema", "JSON Schema", "TypeScript"),
  entry("JSON Schema", "JSON Schema", "Zod Schema"),

  // CSS
  entry("CSS", "CSS", "JS Objects"),
  entry("CSS", "CSS", "TailwindCSS"),
  entry("CSS", "CSS", "template literal"),

  // JavaScript
  entry("JavaScript", "JavaScript", "JSON"),
  entry("JavaScript", "JavaScript", "TypeScript"),

  // GraphQL
  entry("GraphQL", "GraphQL", "Components"),
  entry("GraphQL", "GraphQL", "Flow"),
  entry("GraphQL", "GraphQL", "Fragment Matcher"),
  entry("GraphQL", "GraphQL", "Introspection JSON"),
  entry("GraphQL", "GraphQL", "Java"),
  entry("GraphQL", "GraphQL", "Resolvers Signature"),
  entry("GraphQL", "GraphQL", "Schema AST"),
  entry("GraphQL", "GraphQL", "TypeScript"),
  entry("GraphQL", "GraphQL", "TypeScript MongoDB"),

  // JSON-LD
  entry("JSON-LD", "JSON-LD", "Compacted"),
  entry("JSON-LD", "JSON-LD", "Expanded"),
  entry("JSON-LD", "JSON-LD", "Flattened"),
  entry("JSON-LD", "JSON-LD", "Framed"),
  entry("JSON-LD", "JSON-LD", "N-Quads"),
  entry("JSON-LD", "JSON-LD", "Normalized"),

  // TypeScript
  entry("TypeScript", "TypeScript", "Flow"),
  entry("TypeScript", "TypeScript", "JSON Schema"),
  entry("TypeScript", "TypeScript", "plain JavaScript"),
  entry("TypeScript", "TypeScript", "TypeScript Declaration"),
  entry("TypeScript", "TypeScript", "Zod Schema"),

  // Flow
  entry("Flow", "Flow", "plain JavaScript"),
  entry("Flow", "Flow", "TypeScript"),
  entry("Flow", "Flow", "TypeScript Declaration"),

  // Others
  entry("Other", "Cadence", "Go"),
  entry("Other", "Markdown", "HTML"),
  entry("Other", "TOML", "JSON", JSON_TOML_HREF),
  entry("Other", "TOML", "YAML"),
  entry("Other", "XML", "JSON", XML_TO_JSON_HREF),
  entry("Other", "YAML", "JSON", JSON_YAML_HREF),
  entry("Other", "YAML", "TOML"),
];

export const availableConverters = converters.filter((c) => c.href);
export const categories = Array.from(new Set(converters.map((c) => c.category)));
