"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

export interface CodeOutputProps {
  code: string;
  filename?: string;
  language?: string;
  "data-testid"?: string;
}

export function CodeOutput({ code, filename, language, "data-testid": testId }: CodeOutputProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <div
      data-testid={testId}
      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{filename ?? language}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors px-2 py-1 rounded"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-100 overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}
