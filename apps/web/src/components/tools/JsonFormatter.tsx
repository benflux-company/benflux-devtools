"use client";

import { useState, useEffect, useMemo } from "react";
import { highlightJson } from "../../lib/json-highlighter";
import { validateJson, ValidationResult } from "../../lib/json-formatter";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { JsonTreeNode } from "./JsonTreeNode";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMinified, setIsMinified] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'tree'>('text');
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, parsed: null });
  const { copy, copied } = useCopyToClipboard();

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setValidation(validateJson(input)), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.toggle("dark");
    setIsDark(isDarkMode);
  };
  
  const formattedJson = useMemo(() => {
    if (!validation.valid || validation.parsed === null) return "";
    return isMinified
      ? JSON.stringify(validation.parsed)
      : JSON.stringify(validation.parsed, null, 2);
  }, [validation, isMinified]);

  return (
    <div className="flex flex-col h-full gap-4">
      <header className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">JSON Formatter</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Format, validate, and beautify your JSON</p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Validation Banner */}
      {input.trim() && (
        <div
          data-testid={validation.valid ? 'valid-banner' : 'error'}
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            validation.valid
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          {validation.valid ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Valid JSON</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Invalid JSON:</span>
              <span className="font-mono text-sm">{validation.error}</span>
            </>
          )}
        </div>
      )}
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
          <div className="flex items-center justify-between pb-1">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`text-sm font-medium px-1 pb-1 border-b-2 ${activeTab === 'text' ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Output
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`text-sm font-medium px-1 pb-1 border-b-2 ${activeTab === 'tree' ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Tree
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinified(!isMinified)}
                disabled={!validation.valid || !input.trim()}
                className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMinified ? "Format" : "Minify"}
              </button>
              <button
                onClick={() => copy(formattedJson)}
                disabled={!validation.valid || !input.trim()}
                className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex-1 w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto">
            {!input.trim() ? (
              <p className="text-gray-500 dark:text-gray-400 italic">Formatted JSON will appear here</p>
            ) : !validation.valid ? (
              <p className="text-red-500 dark:text-red-400 italic">Fix the JSON errors to view the formatted output.</p>
            ) : activeTab === 'tree' ? (
              <div className="pt-2">
                <JsonTreeNode value={validation.parsed} />
              </div>
            ) : (
              <pre
                data-testid="output"
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

