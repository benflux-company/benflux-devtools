"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, Label, Textarea } from "@benflux-ui/react";
import { jsonToYaml, yamlToJson, type ConversionResult } from "../../lib/converters/yaml";
import { jsonToToml, tomlToJson } from "../../lib/converters/toml";
import { CodeOutput } from "./CodeOutput";

const CONVERTER_PAIRS = {
  yaml: { leftToRight: jsonToYaml, rightToLeft: yamlToJson },
  toml: { leftToRight: jsonToToml, rightToLeft: tomlToJson },
} satisfies Record<string, { leftToRight: (input: string) => ConversionResult; rightToLeft: (input: string) => ConversionResult }>;

export interface BidirectionalConverterProps {
  kind: keyof typeof CONVERTER_PAIRS;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftLanguage: string;
  rightLanguage: string;
  leftPlaceholder: string;
}

export function BidirectionalConverter({
  kind,
  title,
  description,
  leftLabel,
  rightLabel,
  leftLanguage,
  rightLanguage,
  leftPlaceholder,
}: BidirectionalConverterProps) {
  const { leftToRight: convertLeftToRight, rightToLeft: convertRightToLeft } = CONVERTER_PAIRS[kind];
  const [swapped, setSwapped] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult>({ ok: true, output: "" });

  const sourceLabel = swapped ? rightLabel : leftLabel;
  const targetLabel = swapped ? leftLabel : rightLabel;
  const targetLanguage = swapped ? leftLanguage : rightLanguage;
  const convert = swapped ? convertRightToLeft : convertLeftToRight;

  useEffect(() => {
    const timer = setTimeout(() => setResult(convert(input)), 300);
    return () => clearTimeout(timer);
  }, [input, convert]);

  const handleSwap = () => {
    if (result.ok && result.output) setInput(result.output);
    setSwapped((s) => !s);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>

      {!result.ok && input.trim() && (
        <Alert data-testid="error" variant="destructive">
          <AlertTitle>Conversion failed</AlertTitle>
          <AlertDescription className="font-mono">{result.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <Card className="flex flex-col">
          <CardHeader>
            <Label htmlFor="converter-input">{sourceLabel}</Label>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              id="converter-input"
              className="h-96 font-mono text-sm resize-none"
              placeholder={leftPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="hidden md:flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            aria-label={`Swap to convert ${targetLabel} to ${sourceLabel}`}
            data-testid="swap-direction"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <Label>{targetLabel}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwap}
              className="md:hidden"
              aria-label={`Swap to convert ${targetLabel} to ${sourceLabel}`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {!result.ok || !result.output ? (
              <div className="h-96 w-full flex items-center justify-center text-gray-500 dark:text-gray-400 italic border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                {input.trim() ? "Fix the errors above to see the result" : "Result will appear here"}
              </div>
            ) : (
              <CodeOutput data-testid="output" code={result.output} language={targetLanguage} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
