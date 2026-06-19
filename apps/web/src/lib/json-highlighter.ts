export function highlightJson(json: string): string {
  return json.replace(
    /"(\\.|[^\\"])*"\s*:|"(\\.|[^\\"])*"|-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null/g,
    (match) => {
      if (match.endsWith(':'))             return `<span class="text-blue-400">${match}</span>`
      if (match.startsWith('"'))           return `<span class="text-green-400">${match}</span>`
      if (match === 'true' || match === 'false') return `<span class="text-purple-400">${match}</span>`
      if (match === 'null')                return `<span class="text-red-400">${match}</span>`
      return `<span class="text-orange-400">${match}</span>`
    }
  )
}
