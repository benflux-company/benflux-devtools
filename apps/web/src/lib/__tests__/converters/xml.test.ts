import { xmlToJson } from "../../converters/xml";

describe("xmlToJson", () => {
  it("converts a simple XML document to JSON", () => {
    const result = xmlToJson("<root><name>benflux</name></root>");
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.output)).toEqual({ root: { name: "benflux" } });
  });

  it("preserves attributes with the @_ prefix", () => {
    const result = xmlToJson('<user id="1">alice</user>');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const parsed = JSON.parse(result.output);
      expect(parsed.user["@_id"]).toBe("1");
    }
  });

  it("returns empty output for empty input", () => {
    expect(xmlToJson("   ")).toEqual({ ok: true, output: "" });
  });
});
