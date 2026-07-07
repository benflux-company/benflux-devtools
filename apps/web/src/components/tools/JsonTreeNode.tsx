import { useState } from "react";

function getValueColor(value: unknown) {
  if (value === null) return "text-red-400";
  if (typeof value === "string") return "text-green-400";
  if (typeof value === "number") return "text-orange-400";
  if (typeof value === "boolean") return "text-purple-400";
  return "";
}

function getValueString(value: unknown) {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

export function JsonTreeNode({
  label,
  value,
  isLast = true,
}: {
  label?: string;
  value: unknown;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);

  if (!isObject) {
    return (
      <div className="font-mono text-sm ml-4">
        {label && <span className="text-blue-400">&quot;{label}&quot;</span>}
        {label && <span className="text-gray-400 dark:text-gray-500 mr-1">:</span>}
        <span className={getValueColor(value)}>{getValueString(value)}</span>
        {!isLast && <span className="text-gray-400 dark:text-gray-500">,</span>}
      </div>
    );
  }

  const entries = Object.entries(value as object);
  const isEmpty = entries.length === 0;

  return (
    <div className="font-mono text-sm ml-4">
      <div className="flex items-center -ml-5">
        <button
          onClick={() => setOpen(!open)}
          className="w-4 h-4 mr-1 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          disabled={isEmpty}
        >
          {!isEmpty ? (open ? "▾" : "▸") : " "}
        </button>
        {label && <span className="text-blue-400">&quot;{label}&quot;</span>}
        {label && <span className="text-gray-400 dark:text-gray-500 mr-1">:</span>}
        <span className="text-gray-600 dark:text-gray-400">{isArray ? "[" : "{"}</span>
        {!open && !isEmpty && <span className="text-gray-500 mx-1">...</span>}
        {(!open || isEmpty) && (
          <span className="text-gray-600 dark:text-gray-400">
            {isArray ? "]" : "}"}
            {!isLast && ","}
          </span>
        )}
      </div>

      {open && !isEmpty && (
        <div className="border-l border-gray-300 dark:border-gray-600 ml-[0.1rem] pl-3">
          {entries.map(([k, v], index) => (
            <JsonTreeNode
              key={k}
              label={isArray ? undefined : k}
              value={v}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      )}
      {open && !isEmpty && (
        <div className="text-gray-600 dark:text-gray-400">
          {isArray ? "]" : "}"}
          {!isLast && ","}
        </div>
      )}
    </div>
  );
}
