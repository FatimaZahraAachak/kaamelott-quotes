// Normalize text for search: lowercase + accent stripping.
// Examples: "Évreux" -> "evreux", "C'est" -> "c'est", "Château" -> "chateau"
// NFD decomposes "é" into "e" + combining accent (U+0300–U+036F), which we then strip.
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
