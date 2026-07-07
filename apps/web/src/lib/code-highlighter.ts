import { escapeHtml } from "./html-escape";
import { highlightJson } from "./json-highlighter";

export type CodeLanguage = "json" | "typescript" | "yaml" | "toml";

const TS_KEYWORDS = new Set([
  "export",
  "import",
  "from",
  "interface",
  "type",
  "const",
  "readonly",
  "typeof",
  "as",
]);
const TS_PRIMITIVE_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
  "unknown",
  "void",
  "any",
]);

const TS_TOKEN_RE =
  /(?<string>"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(?<number>\b\d+(?:\.\d+)?\b)|(?<call>\b[A-Za-z_$][\w$]*\b(?=\s*\())|(?<field>\b[A-Za-z_$][\w$]*\b(?=\s*\??\s*:))|(?<ident>\b[A-Za-z_$][\w$]*\b)/g;

function highlightTypeScript(escaped: string): string {
  return escaped.replace(TS_TOKEN_RE, (match, ...args) => {
    const groups = args[args.length - 1] as Record<string, string | undefined>;
    if (groups.string) return `<span class="text-green-400">${match}</span>`;
    if (groups.number) return `<span class="text-orange-400">${match}</span>`;
    if (groups.call) {
      if (TS_KEYWORDS.has(match)) return `<span class="text-purple-400">${match}</span>`;
      return `<span class="text-orange-300">${match}</span>`;
    }
    if (groups.field) return `<span class="text-blue-400">${match}</span>`;
    if (TS_KEYWORDS.has(match)) return `<span class="text-purple-400">${match}</span>`;
    if (TS_PRIMITIVE_TYPES.has(match)) return `<span class="text-cyan-400">${match}</span>`;
    if (/^[A-Z]/.test(match)) return `<span class="text-yellow-400">${match}</span>`;
    return match;
  });
}

function highlightScalarValue(value: string): string {
  const leadingSpace = value.match(/^\s*/)?.[0] ?? "";
  const trimmed = value.slice(leadingSpace.length);
  if (!trimmed) return value;
  if (/^["']/.test(trimmed)) return leadingSpace + `<span class="text-green-400">${trimmed}</span>`;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return leadingSpace + `<span class="text-orange-400">${trimmed}</span>`;
  if (/^(true|false)$/.test(trimmed)) return leadingSpace + `<span class="text-purple-400">${trimmed}</span>`;
  if (/^(null|~)$/.test(trimmed)) return leadingSpace + `<span class="text-red-400">${trimmed}</span>`;
  return leadingSpace + trimmed;
}

function highlightYaml(escaped: string): string {
  return escaped
    .split("\n")
    .map((line) => {
      if (/^\s*#/.test(line)) return `<span class="text-gray-500">${line}</span>`;

      const kv = line.match(/^(\s*(?:- )?)([^\s:#][^:]*?)(:)(\s.*|)$/);
      if (kv) {
        const [, indent, key, colon, rest] = kv;
        return `${indent}<span class="text-blue-400">${key}</span>${colon}${highlightScalarValue(rest)}`;
      }

      const listItem = line.match(/^(\s*- )(.*)$/);
      if (listItem) return `${listItem[1]}${highlightScalarValue(listItem[2])}`;

      return line;
    })
    .join("\n");
}

function highlightToml(escaped: string): string {
  return escaped
    .split("\n")
    .map((line) => {
      const section = line.match(/^(\s*)(\[.*\])(\s*)$/);
      if (section) return `${section[1]}<span class="text-blue-400">${section[2]}</span>${section[3]}`;

      const kv = line.match(/^(\s*)([^\s=]+)(\s*=\s*)(.*)$/);
      if (kv) {
        const [, indent, key, eq, value] = kv;
        return `${indent}<span class="text-blue-400">${key}</span>${eq}${highlightScalarValue(value)}`;
      }

      return line;
    })
    .join("\n");
}

export function highlightCode(code: string, language: CodeLanguage): string {
  if (language === "json") return highlightJson(code);
  const escaped = escapeHtml(code);
  if (language === "typescript") return highlightTypeScript(escaped);
  if (language === "yaml") return highlightYaml(escaped);
  return highlightToml(escaped);
}
