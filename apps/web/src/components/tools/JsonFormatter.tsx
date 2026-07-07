"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@benflux-ui/react";
import { highlightJson } from "../../lib/json-highlighter";
import { formatJson, validateJson, ValidationResult } from "../../lib/json-formatter";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { JsonTreeNode } from "./JsonTreeNode";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [isMinified, setIsMinified] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "tree">("text");
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, parsed: null });
  const { copy, copied } = useCopyToClipboard();

  useEffect(() => {
    const timer = setTimeout(() => setValidation(validateJson(input)), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const formattedJson = useMemo(() => {
    if (!validation.valid || validation.parsed === null) return "";
    return formatJson(validation.parsed, isMinified);
  }, [validation, isMinified]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">JSON Formatter</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Format, validate, and beautify your JSON
        </p>
      </div>

      {input.trim() && (
        <Alert
          data-testid={validation.valid ? "valid-banner" : "error"}
          variant={validation.valid ? "success" : "destructive"}
        >
          <AlertTitle>{validation.valid ? "Valid JSON" : "Invalid JSON"}</AlertTitle>
          {!validation.valid && <AlertDescription className="font-mono">{validation.error}</AlertDescription>}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <Label htmlFor="json-input">Input</Label>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              id="json-input"
              className="h-80 font-mono text-sm resize-none"
              placeholder='{"name": "Benflux", "version": "1.0.0"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "tree")}>
              <TabsList>
                <TabsTrigger value="text">Output</TabsTrigger>
                <TabsTrigger value="tree">Tree</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinified(!isMinified)}
                disabled={!validation.valid || !input.trim()}
              >
                {isMinified ? "Format" : "Minify"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(formattedJson)}
                disabled={!validation.valid || !input.trim()}
                leftIcon={copied ? <Check className="text-green-500" /> : <Copy />}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-80 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
              {!input.trim() ? (
                <CardDescription className="italic">Formatted JSON will appear here</CardDescription>
              ) : !validation.valid ? (
                <CardDescription className="italic text-destructive">
                  Fix the JSON errors to view the formatted output.
                </CardDescription>
              ) : activeTab === "tree" ? (
                <JsonTreeNode value={validation.parsed} />
              ) : (
                <pre
                  data-testid="output"
                  className="text-sm font-mono whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightJson(formattedJson) }}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
