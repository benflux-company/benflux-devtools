import { validateJson, formatJson } from "../json-formatter";

describe("validateJson", () => {
  it("returns valid for a correct JSON object", () => {
    expect(validateJson('{"a":1}').valid).toBe(true);
  });

  it("returns valid for an array", () => {
    expect(validateJson("[1,2,3]").valid).toBe(true);
  });

  it("returns valid for nested objects", () => {
    expect(validateJson('{"user": {"name": "Test", "roles": [1, 2]}}').valid).toBe(true);
  });

  it("returns valid for unicode JSON", () => {
    expect(validateJson('{"emoji": "🚀", "text": "你好"}').valid).toBe(true);
  });

  it("returns invalid for malformed JSON", () => {
    expect(validateJson("{a:1}").valid).toBe(false);
  });

  it("returns invalid for plain text", () => {
    expect(validateJson("Just some text").valid).toBe(false);
  });

  it("returns null parsed for empty string", () => {
    const result = validateJson("");
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.parsed).toBeNull();
  });

  it("returns null parsed for whitespace string", () => {
    const result = validateJson("   \n  ");
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.parsed).toBeNull();
  });
});

describe("formatJson", () => {
  it("formats JSON with 2 spaces by default", () => {
    const parsed = { a: 1, b: 2 };
    expect(formatJson(parsed)).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it("minifies JSON when isMinified is true", () => {
    const parsed = { a: 1, b: 2 };
    expect(formatJson(parsed, true)).toBe('{"a":1,"b":2}');
  });

  it("handles nested objects in formatting", () => {
    const parsed = { nested: { arr: [1] } };
    expect(formatJson(parsed)).toBe('{\n  "nested": {\n    "arr": [\n      1\n    ]\n  }\n}');
  });
});
