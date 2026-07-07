import { inferRoot } from "../../schema-inference";
import { generateTypeScript } from "../../generators/typescript";

describe("generateTypeScript", () => {
  it("generates a flat interface", () => {
    const types = inferRoot({ name: "benflux", stars: 42 });
    const output = generateTypeScript(types, { rootName: "Repo" });
    expect(output).toBe(
      "export interface Repo {\n  name: string;\n  stars: number;\n}",
    );
  });

  it("marks optional fields inferred by array-sampling with a `?`", () => {
    const types = inferRoot([{ id: 1, name: "a" }, { id: 2 }]);
    const output = generateTypeScript(types, { rootName: "Item" });
    expect(output).toContain("id: number;");
    expect(output).toContain("name?: string;");
  });

  it("hoists nested objects into their own named interface", () => {
    const types = inferRoot({ user: { name: "alice", age: 30 } });
    const output = generateTypeScript(types, { rootName: "Root" });
    expect(output).toContain("export interface Root {\n  user: User;\n}");
    expect(output).toContain("export interface User {\n  name: string;\n  age: number;\n}");
  });

  it("renders arrays of hoisted objects as Name[]", () => {
    const types = inferRoot({ tags: [{ id: 1 }, { id: 2 }] });
    const output = generateTypeScript(types, { rootName: "Root" });
    expect(output).toContain("tags: Tag[];");
    expect(output).toContain("export interface Tag {\n  id: number;\n}");
  });

  it("renders string literal unions", () => {
    const types = inferRoot([{ status: "active" }, { status: "inactive" }, { status: "active" }]);
    const output = generateTypeScript(types, { rootName: "Root" });
    expect(output).toContain('status: "active" | "inactive";');
  });

  it("supports `type` alias mode instead of interface", () => {
    const types = inferRoot({ name: "a" });
    const output = generateTypeScript(types, { rootName: "Root", useType: true });
    expect(output).toBe("export type Root = {\n  name: string;\n};");
  });

  it("supports readonly fields", () => {
    const types = inferRoot({ name: "a" });
    const output = generateTypeScript(types, { rootName: "Root", readonly: true });
    expect(output).toContain("readonly name: string;");
  });

  it("omits the export keyword when disabled", () => {
    const types = inferRoot({ name: "a" });
    const output = generateTypeScript(types, { rootName: "Root", exportDeclarations: false });
    expect(output.startsWith("interface Root")).toBe(true);
  });

  it("dedupes colliding nested type names", () => {
    // "foo_bar" and "fooBar" both PascalCase to "FooBar" — the second must be renamed.
    const types = inferRoot({ foo_bar: { id: 1 }, fooBar: { id: 2 } });
    const output = generateTypeScript(types, { rootName: "Root" });
    expect(output).toContain("export interface FooBar {");
    expect(output).toContain("export interface FooBar2 {");
    const interfaceCount = (output.match(/export interface/g) || []).length;
    expect(interfaceCount).toBe(3);
  });
});
