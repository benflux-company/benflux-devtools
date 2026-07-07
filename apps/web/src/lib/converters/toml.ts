import { parse, stringify } from "smol-toml";
import type { ConversionResult } from "./yaml";

export function jsonToToml(jsonText: string): ConversionResult {
  if (!jsonText.trim()) return { ok: true, output: "" };
  try {
    const parsed = JSON.parse(jsonText);
    return { ok: true, output: stringify(parsed) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function tomlToJson(tomlText: string): ConversionResult {
  if (!tomlText.trim()) return { ok: true, output: "" };
  try {
    const parsed = parse(tomlText);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
