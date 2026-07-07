"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Badge, Card, Input } from "@benflux-ui/react";
import { categories, converters } from "../../lib/converters-registry";

export function ConvertersHub() {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? converters.filter(
          (c) =>
            c.from.toLowerCase().includes(q) ||
            c.to.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q),
        )
      : converters;

    return categories
      .map((category) => ({ category, items: filtered.filter((c) => c.category === category) }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const resultCount = grouped.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Converters</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Search and browse every format conversion on the roadmap — from JSON and YAML to GraphQL and beyond.
        </p>
      </div>

      <Input
        data-testid="converters-search"
        placeholder="Search a format, e.g. &quot;yaml&quot; or &quot;GraphQL&quot;"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftElement={<Search className="w-4 h-4" />}
        className="max-w-md"
      />

      <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="converters-count">
        {resultCount} {resultCount === 1 ? "conversion" : "conversions"}
      </p>

      <div className="flex flex-col gap-8">
        {grouped.map((group) => (
          <div key={group.category}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((item) => {
                const available = Boolean(item.href);
                const content = (
                  <Card
                    className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                      available
                        ? "hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer"
                        : "opacity-60"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.from} <span className="text-gray-400 dark:text-gray-500">&rarr;</span> {item.to}
                      </p>
                    </div>
                    {available ? (
                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <Badge variant="secondary" size="sm" className="shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Soon
                      </Badge>
                    )}
                  </Card>
                );

                return item.href ? (
                  <Link key={item.id} href={item.href} data-testid={`converter-${item.id}`}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.id} data-testid={`converter-${item.id}`}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {resultCount === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No conversions match &quot;{query}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
