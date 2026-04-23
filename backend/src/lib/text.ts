// Normalise un texte pour la recherche : minuscules + suppression des accents.
// Ex : "Évreux" -> "evreux", "C'est" -> "c'est", "Château" -> "chateau"
// NFD décompose "é" en "e" + accent combinant (U+0300–U+036F), qu'on retire ensuite.
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
