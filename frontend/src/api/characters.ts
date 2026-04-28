type CharactersResponse = { data: string[] }

export async function fetchCharacters(): Promise<CharactersResponse> {
  let res: Response
  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}/characters`)
  } catch {
    throw new Error('Le serveur est injoignable.')
  }
  if (!res.ok) {
    throw new Error('Erreur serveur. Réessaie plus tard.')
  }
  return res.json()
}
