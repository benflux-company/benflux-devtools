import { jsonToToml, tomlToJson } from "../../converters/toml";

describe("jsonToToml", () => {
  it("converts a JSON object to TOML", () => {
    const result = jsonToToml('{"name":"benflux","stars":42}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain('name = "benflux"');
      expect(result.output).toContain("stars = 42");
    }
  });

  it("returns an error for invalid JSON", () => {
    expect(jsonToToml("{invalid}").ok).toBe(false);
  });

  it("returns an error when the JSON root isn't a table (TOML requires an object)", () => {
    expect(jsonToToml("[1,2,3]").ok).toBe(false);
  });
});

describe("tomlToJson", () => {
  it("converts TOML to a formatted JSON string", () => {
    const result = tomlToJson('name = "benflux"\nstars = 42\n');
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.output)).toEqual({ name: "benflux", stars: 42 });
  });

  it("returns an error for invalid TOML", () => {
    expect(tomlToJson("not = = valid").ok).toBe(false);
  });

  it("round-trips JSON -> TOML -> JSON", () => {
    const original = { a: 1, nested: { b: "x" } };
    const toToml = jsonToToml(JSON.stringify(original));
    expect(toToml.ok).toBe(true);
    if (!toToml.ok) return;
    const backToJson = tomlToJson(toToml.output);
    expect(backToJson.ok).toBe(true);
    if (backToJson.ok) expect(JSON.parse(backToJson.output)).toEqual(original);
  });
});
