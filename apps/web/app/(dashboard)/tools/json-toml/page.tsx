import { BidirectionalConverter } from "@/src/components/tools/BidirectionalConverter";

export default function JsonTomlPage() {
  return (
    <BidirectionalConverter
      kind="toml"
      title="JSON ⇄ TOML"
      description="Convert between JSON and TOML in either direction"
      leftLabel="JSON"
      rightLabel="TOML"
      leftLanguage="json"
      rightLanguage="toml"
      leftPlaceholder='{"name": "Benflux", "version": "1.0.0"}'
    />
  );
}
