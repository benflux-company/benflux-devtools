import type { Metadata } from "next";
import { ConvertersHub } from "@/src/components/converters/ConvertersHub";

export const metadata: Metadata = {
  title: "Converters – Benflux DevTools",
  description: "Search and browse every format conversion tool",
};

export default function ConvertersPage() {
  return <ConvertersHub />;
}
