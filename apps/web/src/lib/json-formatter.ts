export type ValidationResult =
  | { valid: true; parsed: unknown }
  | { valid: false; error: string };

export function validateJson(input: string): ValidationResult {
  if (!input.trim()) return { valid: true, parsed: null };
  try {
    return { valid: true, parsed: JSON.parse(input) };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export function formatJson(parsed: unknown, isMinified = false): string {
  return isMinified ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
}
