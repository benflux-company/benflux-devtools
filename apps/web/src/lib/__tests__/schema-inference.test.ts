import { inferRoot, inferTypes } from "../schema-inference";

describe("inferRoot", () => {
  it("infers primitive types", () => {
    expect(inferRoot("hello")).toEqual([{ kind: "string", formats: [], literals: null }]);
    expect(inferRoot(42)).toEqual([{ kind: "number", isInteger: true }]);
    expect(inferRoot(4.2)).toEqual([{ kind: "number", isInteger: false }]);
    expect(inferRoot(true)).toEqual([{ kind: "boolean" }]);
    expect(inferRoot(null)).toEqual([{ kind: "null" }]);
  });

  it("infers a flat object shape", () => {
    const result = inferRoot({ name: "benflux", stars: 42 });
    expect(result).toEqual([
      {
        kind: "object",
        fields: [
          { key: "name", optional: false, types: [{ kind: "string", formats: [], literals: null }] },
          { key: "stars", optional: false, types: [{ kind: "number", isInteger: true }] },
        ],
      },
    ]);
  });

  it("detects fields as optional by sampling every element of an array, not just the first", () => {
    const result = inferRoot([{ id: 1, name: "a" }, { id: 2 }, { id: 3, name: "c" }]);
    const arrayType = result[0];
    expect(arrayType.kind).toBe("array");
    if (arrayType.kind !== "array") throw new Error("expected array");
    const objectType = arrayType.items[0];
    expect(objectType.kind).toBe("object");
    if (objectType.kind !== "object") throw new Error("expected object");
    const nameField = objectType.fields.find((f) => f.key === "name")!;
    expect(nameField.optional).toBe(true);
    const idField = objectType.fields.find((f) => f.key === "id")!;
    expect(idField.optional).toBe(false);
  });

  it("detects a string literal union when values repeat across samples", () => {
    const result = inferRoot([{ status: "active" }, { status: "inactive" }, { status: "active" }]);
    const arrayType = result[0];
    if (arrayType.kind !== "array") throw new Error("expected array");
    const objectType = arrayType.items[0];
    if (objectType.kind !== "object") throw new Error("expected object");
    const statusField = objectType.fields[0];
    expect(statusField.types[0]).toEqual({
      kind: "string",
      formats: [],
      literals: ["active", "inactive"],
    });
  });

  it("does not treat all-unique free text as a literal union", () => {
    const result = inferRoot([{ name: "alice" }, { name: "bob" }]);
    const arrayType = result[0];
    if (arrayType.kind !== "array") throw new Error("expected array");
    const objectType = arrayType.items[0];
    if (objectType.kind !== "object") throw new Error("expected object");
    expect(objectType.fields[0].types[0]).toEqual({ kind: "string", formats: [], literals: null });
  });

  it("detects ISO 8601 date-time strings as a format", () => {
    const result = inferTypes(["2024-01-15T10:30:00Z", "2024-02-20T08:00:00.000Z"]);
    expect(result).toEqual([{ kind: "string", formats: ["date-time"], literals: null }]);
  });

  it("detects UUID strings as a format", () => {
    const result = inferTypes(["123e4567-e89b-12d3-a456-426614174000"]);
    expect(result).toEqual([{ kind: "string", formats: ["uuid"], literals: null }]);
  });

  it("detects email strings as a format", () => {
    const result = inferTypes(["a@example.com", "b@example.com"]);
    expect(result).toEqual([{ kind: "string", formats: ["email"], literals: null }]);
  });

  it("marks null as its own variant alongside other types", () => {
    const result = inferTypes(["a", null]);
    expect(result).toEqual([
      { kind: "string", formats: [], literals: null },
      { kind: "null" },
    ]);
  });

  it("returns unknown for an empty array (no samples to learn from)", () => {
    const result = inferRoot([]);
    expect(result).toEqual([{ kind: "array", items: [{ kind: "unknown" }] }]);
  });

  it("merges mixed-type fields into a union of variants", () => {
    const result = inferTypes(["a", 1, true]);
    expect(result).toEqual([
      { kind: "string", formats: [], literals: null },
      { kind: "number", isInteger: true },
      { kind: "boolean" },
    ]);
  });
});
