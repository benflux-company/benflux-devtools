import { highlightCode } from "../code-highlighter";

describe("highlightCode - typescript", () => {
  it("colors keywords, primitive types, string literals, and numbers", () => {
    const html = highlightCode('export interface Root {\n  name: string;\n  stars: number;\n}', "typescript");
    expect(html).toContain('<span class="text-purple-400">export</span>');
    expect(html).toContain('<span class="text-purple-400">interface</span>');
    expect(html).toContain('<span class="text-cyan-400">string</span>');
    expect(html).toContain('<span class="text-cyan-400">number</span>');
  });

  it("colors a hoisted PascalCase type reference", () => {
    const html = highlightCode("export interface Root {\n  user: User;\n}", "typescript");
    expect(html).toContain('<span class="text-yellow-400">User</span>');
  });

  it("colors zod method calls and string literals", () => {
    const html = highlightCode('const x = z.string().email();', "typescript");
    expect(html).toContain('<span class="text-orange-300">string</span>');
    expect(html).toContain('<span class="text-orange-300">email</span>');
  });

  it("escapes HTML in a malicious field name (XSS regression)", () => {
    const malicious = 'export interface Root {\n  <img src=x onerror=alert(1)>: string;\n}';
    const html = highlightCode(malicious, "typescript");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("highlightCode - yaml", () => {
  it("colors keys, string values, numbers, and booleans", () => {
    const html = highlightCode('name: benflux\nstars: 42\nactive: true\n', "yaml");
    expect(html).toContain('<span class="text-blue-400">name</span>');
    expect(html).toContain('<span class="text-orange-400">42</span>');
    expect(html).toContain('<span class="text-purple-400">true</span>');
  });

  it("colors list item values", () => {
    const html = highlightCode("tags:\n  - a\n  - 1\n", "yaml");
    expect(html).toContain('<span class="text-orange-400">1</span>');
  });

  it("escapes HTML in a malicious value (XSS regression)", () => {
    const malicious = 'a: "<img src=x onerror=alert(1)>"\n';
    const html = highlightCode(malicious, "yaml");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("highlightCode - toml", () => {
  it("colors keys, string values, and section headers", () => {
    const html = highlightCode('name = "benflux"\n[nested]\nstars = 42\n', "toml");
    expect(html).toContain('<span class="text-blue-400">name</span>');
    expect(html).toContain('<span class="text-green-400">"benflux"</span>');
    expect(html).toContain('<span class="text-blue-400">[nested]</span>');
    expect(html).toContain('<span class="text-orange-400">42</span>');
  });

  it("escapes HTML in a malicious value (XSS regression)", () => {
    const malicious = 'a = "<img src=x onerror=alert(1)>"\n';
    const html = highlightCode(malicious, "toml");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("highlightCode - json", () => {
  it("delegates to the existing JSON highlighter", () => {
    const html = highlightCode('{"a": 1}', "json");
    expect(html).toContain('<span class="text-blue-400">"a":</span>');
  });
});
