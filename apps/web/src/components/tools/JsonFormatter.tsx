"use client";

import { useState } from "react";
import { highlightJson } from "../../lib/json-highlighter";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  
  let formattedJson = "";
  let error = false;
  
  if (input) {
    try {
      const parsed = JSON.parse(input);
      formattedJson = JSON.stringify(parsed, null, 2);
    } catch (e) {
      error = true;
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <header className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">JSON Formatter</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Format, validate, and beautify your JSON</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</label>
          <textarea
            className="flex-1 w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder='{"name": "Benflux", "version": "1.0.0"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
          <div className="flex-1 w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto">
            {!input ? (
              <p className="text-gray-500 dark:text-gray-400 italic">Formatted JSON will appear here</p>
            ) : error ? (
              <p className="text-red-500">Invalid JSON</p>
            ) : (
              <pre
                className="text-sm font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightJson(formattedJson) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

