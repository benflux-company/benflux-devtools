import { BidirectionalConverter } from "@/src/components/tools/BidirectionalConverter";

export default function JsonYamlPage() {
  return (
    <BidirectionalConverter
      kind="yaml"
      title="JSON ⇄ YAML"
      description="Convert between JSON and YAML in either direction"
      leftLabel="JSON"
      rightLabel="YAML"
      leftLanguage="json"
      rightLanguage="yaml"
      leftPlaceholder='{"name": "Benflux", "version": "1.0.0"}'
    />
  );
}
