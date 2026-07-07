"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle, Card, CardContent, CardHeader, Label, Textarea } from "@benflux-ui/react";
import { xmlToJson } from "../../lib/converters/xml";
import type { ConversionResult } from "../../lib/converters/yaml";
import { CodeOutput } from "./CodeOutput";

export function XmlToJson() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult>({ ok: true, output: "" });

  useEffect(() => {
    const timer = setTimeout(() => setResult(xmlToJson(input)), 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">XML &rarr; JSON</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Convert XML documents to JSON, attributes included</p>
      </div>

      {!result.ok && input.trim() && (
        <Alert data-testid="error" variant="destructive">
          <AlertTitle>Conversion failed</AlertTitle>
          <AlertDescription className="font-mono">{result.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <Label htmlFor="xml-input">XML</Label>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              id="xml-input"
              className="h-96 font-mono text-sm resize-none"
              placeholder={'<user id="1">\n  <name>Benflux</name>\n</user>'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <Label>JSON</Label>
          </CardHeader>
          <CardContent className="flex-1">
            {!result.ok || !result.output ? (
              <div className="h-96 w-full flex items-center justify-center text-gray-500 dark:text-gray-400 italic border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                {input.trim() ? "Fix the XML above to see the result" : "Result will appear here"}
              </div>
            ) : (
              <CodeOutput data-testid="output" code={result.output} language="json" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
