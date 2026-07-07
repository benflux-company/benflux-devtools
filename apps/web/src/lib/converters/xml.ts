import { XMLParser } from "fast-xml-parser";
import type { ConversionResult } from "./yaml";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export function xmlToJson(xmlText: string): ConversionResult {
  if (!xmlText.trim()) return { ok: true, output: "" };
  try {
    const parsed = parser.parse(xmlText);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
