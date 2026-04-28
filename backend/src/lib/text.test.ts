import { describe, it, expect } from 'vitest'
import { normalizeText } from './text'

describe('normalizeText', () => {
  it('lowercases the input', () => {
    expect(normalizeText('BONJOUR')).toBe('bonjour')
    expect(normalizeText('Kaamelott')).toBe('kaamelott')
  })

  it('strips accents (NFD + combining marks)', () => {
    expect(normalizeText('Évreux')).toBe('evreux')
    expect(normalizeText('Château')).toBe('chateau')
    expect(normalizeText('Père')).toBe('pere')
  })

  it('combines lowercasing and accent stripping', () => {
    expect(normalizeText('ÉVREUX')).toBe('evreux')
  })

  it('preserves apostrophes and punctuation', () => {
    expect(normalizeText("C'est pas faux")).toBe("c'est pas faux")
  })

  it('returns an empty string for an empty input', () => {
    expect(normalizeText('')).toBe('')
  })

  it('leaves an already-normalized string unchanged', () => {
    expect(normalizeText('bonjour')).toBe('bonjour')
  })
})
