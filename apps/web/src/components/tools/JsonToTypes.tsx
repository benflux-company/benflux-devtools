"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Input,
  Label,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@benflux-ui/react";
import { validateJson, ValidationResult } from "../../lib/json-formatter";
import { inferRoot } from "../../lib/schema-inference";
import { generateTypeScript } from "../../lib/generators/typescript";
import { generateZod } from "../../lib/generators/zod";
import { generateJsonSchema } from "../../lib/generators/json-schema";
import { CodeOutput } from "./CodeOutput";
import type { CodeLanguage } from "../../lib/code-highlighter";

type OutputFormat = "typescript" | "zod" | "json-schema";

export function JsonToTypes() {
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [useTypeAlias, setUseTypeAlias] = useState(false);
  const [readonlyFields, setReadonlyFields] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("typescript");
  // null means "not yet validated for the current input" — distinct from a
  // legitimate parsed JSON `null`, which would otherwise flash a bogus
  // "type Root = null" while the debounce for the current input is pending.
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setValidation(validateJson(input)), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const safeRootName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(rootName) ? rootName : "Root";

  const output = useMemo(() => {
    if (!validation || !validation.valid || !input.trim()) return "";
    const inferred = inferRoot(validation.parsed);
    if (format === "typescript") {
      return generateTypeScript(inferred, { rootName: safeRootName, useType: useTypeAlias, readonly: readonlyFields });
    }
    if (format === "zod") {
      return generateZod(inferred, { rootName: safeRootName });
    }
    return generateJsonSchema(inferred, { title: safeRootName });
  }, [validation, format, safeRootName, useTypeAlias, readonlyFields, input]);

  const languageFor: Record<OutputFormat, CodeLanguage> = {
    typescript: "typescript",
    zod: "typescript",
    "json-schema": "json",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">JSON &rarr; Types</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Infer TypeScript interfaces, Zod schemas, or JSON Schema from real JSON data
        </p>
      </div>

      {input.trim() && validation && !validation.valid && (
        <Alert data-testid="error" variant="destructive">
          <AlertTitle>Invalid JSON</AlertTitle>
          <AlertDescription className="font-mono">{validation.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <Label htmlFor="json-to-types-input">JSON input</Label>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              id="json-to-types-input"
              className="h-96 font-mono text-sm resize-none"
              placeholder='{"id": "123e4567-e89b-12d3-a456-426614174000", "name": "Benflux", "tags": ["a", "b"]}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row flex-nowrap items-center gap-2 space-y-0 px-3 py-2.5 overflow-x-auto">
            <Tabs value={format} onValueChange={(v) => setFormat(v as OutputFormat)} className="shrink-0">
              <TabsList>
                <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                <TabsTrigger value="zod">Zod</TabsTrigger>
                <TabsTrigger value="json-schema">JSON Schema</TabsTrigger>
              </TabsList>
            </Tabs>

            <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-1 shrink-0">
              <Label htmlFor="root-name" className="text-xs whitespace-nowrap">
                Name
              </Label>
              <Input
                id="root-name"
                data-testid="root-name-input"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="h-7 w-20 text-xs px-2"
              />
            </div>

            {format === "typescript" && (
              <>
                <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 shrink-0 whitespace-nowrap">
                  <Switch
                    data-testid="use-type-switch"
                    size="sm"
                    checked={useTypeAlias}
                    onCheckedChange={setUseTypeAlias}
                  />
                  Type alias
                </label>
                <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 shrink-0 whitespace-nowrap">
                  <Switch size="sm" checked={readonlyFields} onCheckedChange={setReadonlyFields} />
                  Readonly
                </label>
              </>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {!output ? (
              <div className="h-96 w-full flex items-center justify-center text-gray-500 dark:text-gray-400 italic border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                {input.trim() ? "Fix the JSON errors to generate types" : "Generated types will appear here"}
              </div>
            ) : (
              <CodeOutput
                data-testid="output"
                code={output}
                language={languageFor[format]}
                filename={format === "json-schema" ? "schema.json" : `${safeRootName.toLowerCase()}.ts`}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
