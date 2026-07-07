import { inferRoot } from "../../schema-inference";
import { generateZod } from "../../generators/zod";

describe("generateZod", () => {
  it("generates a flat object schema with a matching inferred type export", () => {
    const types = inferRoot({ name: "benflux", stars: 42 });
    const output = generateZod(types, { rootName: "Repo" });
    expect(output).toContain('import { z } from "zod";');
    expect(output).toContain(
      "export const RepoSchema = z.object({\n" + '  "name": z.string(),\n' + '  "stars": z.number().int(),\n' + "});",
    );
    expect(output).toContain("export type Repo = z.infer<typeof RepoSchema>;");
  });

  it("marks optional fields with .optional()", () => {
    const types = inferRoot([{ id: 1, name: "a" }, { id: 2 }]);
    const output = generateZod(types, { rootName: "Item" });
    expect(output).toContain('"name": z.string().optional()');
  });

  it("hoists nested objects into their own const schema", () => {
    const types = inferRoot({ user: { name: "alice" } });
    const output = generateZod(types, { rootName: "Root" });
    expect(output).toContain("const UserSchema = z.object({\n" + '  "name": z.string(),\n' + "});");
    expect(output).toContain('"user": UserSchema');
  });

  it("uses z.enum for detected string literal unions", () => {
    const types = inferRoot([{ status: "active" }, { status: "inactive" }, { status: "active" }]);
    const output = generateZod(types, { rootName: "Root" });
    expect(output).toContain('"status": z.enum(["active", "inactive"])');
  });

  it("chains format validators for date-time, uuid, and email", () => {
    expect(generateZod(inferRoot({ at: "2024-01-01T00:00:00Z" }))).toContain('"at": z.string().datetime()');
    expect(generateZod(inferRoot({ id: "123e4567-e89b-12d3-a456-426614174000" }))).toContain(
      '"id": z.string().uuid()',
    );
    expect(generateZod(inferRoot({ email: "a@example.com" }))).toContain('"email": z.string().email()');
  });

  it("wraps nullable fields with .nullable()", () => {
    const types = inferRoot({ tag: null });
    const output = generateZod(types, { rootName: "Root" });
    expect(output).toContain('"tag": z.null()');
  });

  it("wraps arrays with z.array()", () => {
    const types = inferRoot({ tags: ["a", "b", "c", "a"] });
    const output = generateZod(types, { rootName: "Root" });
    expect(output).toMatch(/"tags": z\.array\(z\.(string\(\)|enum)/);
  });

  it("omits the inferred type export when disabled", () => {
    const types = inferRoot({ name: "a" });
    const output = generateZod(types, { rootName: "Root", exportType: false });
    expect(output).not.toContain("z.infer");
  });
});
