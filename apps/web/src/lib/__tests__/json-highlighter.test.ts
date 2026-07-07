import { highlightJson } from "../json-highlighter";

describe("highlightJson", () => {
  it("wraps string values in a colored span", () => {
    const html = highlightJson('{\n  "name": "benflux"\n}');
    expect(html).toContain('<span class="text-green-400">"benflux"</span>');
  });

  it("wraps keys, numbers, booleans and null in colored spans", () => {
    const html = highlightJson('{\n  "n": 1,\n  "b": true,\n  "x": null\n}');
    expect(html).toContain('<span class="text-blue-400">"n":</span>');
    expect(html).toContain('<span class="text-orange-400">1</span>');
    expect(html).toContain('<span class="text-purple-400">true</span>');
    expect(html).toContain('<span class="text-red-400">null</span>');
  });

  // Regression test: string values must never inject raw HTML/script tags
  // into the page via the dangerouslySetInnerHTML output.
  it("escapes HTML special characters inside string values (XSS)", () => {
    const malicious = '{\n  "a": "<img src=x onerror=alert(1)>"\n}';
    const html = highlightJson(malicious);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("escapes ampersands", () => {
    const html = highlightJson('{"a": "Tom & Jerry"}');
    expect(html).toContain("Tom &amp; Jerry");
  });
});
