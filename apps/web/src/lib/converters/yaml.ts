import * as yaml from "js-yaml";

export type ConversionResult = { ok: true; output: string } | { ok: false; error: string };

export function jsonToYaml(jsonText: string): ConversionResult {
  if (!jsonText.trim()) return { ok: true, output: "" };
  try {
    const parsed = JSON.parse(jsonText);
    return { ok: true, output: yaml.dump(parsed) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function yamlToJson(yamlText: string): ConversionResult {
  if (!yamlText.trim()) return { ok: true, output: "" };
  try {
    const parsed = yaml.load(yamlText);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
