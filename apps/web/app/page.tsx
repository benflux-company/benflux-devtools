import Link from "next/link";
import { Braces } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@benflux-ui/react";

const tools = [
  {
    name: "JSON Formatter",
    description: "Validate, format, minify, and explore JSON with syntax highlighting and a tree view.",
    href: "/tools/json-formatter",
    icon: Braces,
    status: "Available",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Benflux DevTools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Community-driven developer tools, built in the open.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.href} className="flex flex-col">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle>{tool.name}</CardTitle>
                <Badge variant="success" size="sm">
                  {tool.status}
                </Badge>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <Button asChild className="w-full">
                <Link href={tool.href}>Open tool</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
