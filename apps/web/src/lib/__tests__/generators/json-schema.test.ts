import { inferRoot } from "../../schema-inference";
import { generateJsonSchema } from "../../generators/json-schema";

describe("generateJsonSchema", () => {
  it("generates a draft-07 object schema with required fields", () => {
    const types = inferRoot({ name: "benflux", stars: 42 });
    const schema = JSON.parse(generateJsonSchema(types, { title: "Repo" }));
    expect(schema.$schema).toBe("http://json-schema.org/draft-07/schema#");
    expect(schema.title).toBe("Repo");
    expect(schema.type).toBe("object");
    expect(schema.properties).toEqual({
      name: { type: "string" },
      stars: { type: "integer" },
    });
    expect(schema.required.sort()).toEqual(["name", "stars"]);
  });

  it("omits array-sampled optional fields from required", () => {
    const types = inferRoot([{ id: 1, name: "a" }, { id: 2 }]);
    const schema = JSON.parse(generateJsonSchema(types));
    const itemSchema = schema.items;
    expect(itemSchema.required).toEqual(["id"]);
  });

  it("uses enum for detected string literal unions", () => {
    const types = inferRoot([{ status: "active" }, { status: "inactive" }, { status: "active" }]);
    const schema = JSON.parse(generateJsonSchema(types));
    expect(schema.items.properties.status.enum).toEqual(["active", "inactive"]);
  });

  it("adds a format keyword for detected date-time/uuid/email strings", () => {
    const schema = JSON.parse(generateJsonSchema(inferRoot({ at: "2024-01-01T00:00:00Z" })));
    expect(schema.properties.at.format).toBe("date-time");
  });

  it("represents nullable fields with a type array", () => {
    const schema = JSON.parse(generateJsonSchema(inferRoot([{ tag: "hi" }, { tag: null }])));
    const itemSchema = schema.items;
    expect(itemSchema.properties.tag.type.sort()).toEqual(["null", "string"]);
    // present in every sample (as null), so it's nullable but not optional
    expect(itemSchema.required).toEqual(["tag"]);
  });

  it("nests array items schema", () => {
    const schema = JSON.parse(generateJsonSchema(inferRoot({ tags: ["a", "b"] })));
    expect(schema.properties.tags.type).toBe("array");
    expect(schema.properties.tags.items.type).toBe("string");
  });
});
