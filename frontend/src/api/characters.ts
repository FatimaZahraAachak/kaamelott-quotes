type CharactersResponse = { data: string[] }

export async function fetchCharacters(): Promise<CharactersResponse> {
  const res = await fetch('/characters')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}
