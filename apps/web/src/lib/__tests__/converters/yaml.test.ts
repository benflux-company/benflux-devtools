import { jsonToYaml, yamlToJson } from "../../converters/yaml";

describe("jsonToYaml", () => {
  it("converts a JSON object to YAML", () => {
    const result = jsonToYaml('{"name":"benflux","stars":42}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toBe("name: benflux\nstars: 42\n");
  });

  it("returns an error for invalid JSON", () => {
    const result = jsonToYaml("{invalid}");
    expect(result.ok).toBe(false);
  });

  it("returns empty output for empty input", () => {
    const result = jsonToYaml("   ");
    expect(result).toEqual({ ok: true, output: "" });
  });
});

describe("yamlToJson", () => {
  it("converts YAML to a formatted JSON string", () => {
    const result = yamlToJson("name: benflux\nstars: 42\n");
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.output)).toEqual({ name: "benflux", stars: 42 });
  });

  it("returns an error for invalid YAML", () => {
    const result = yamlToJson("name: [unterminated");
    expect(result.ok).toBe(false);
  });

  it("round-trips JSON -> YAML -> JSON", () => {
    const original = { a: 1, b: ["x", "y"], c: { nested: true } };
    const toYaml = jsonToYaml(JSON.stringify(original));
    expect(toYaml.ok).toBe(true);
    if (!toYaml.ok) return;
    const backToJson = yamlToJson(toYaml.output);
    expect(backToJson.ok).toBe(true);
    if (backToJson.ok) expect(JSON.parse(backToJson.output)).toEqual(original);
  });
});
