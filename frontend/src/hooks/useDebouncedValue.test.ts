import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('a', 400))
    expect(result.current).toBe('a')
  })

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ v }) => useDebouncedValue(v, 400),
      { initialProps: { v: 'a' } },
    )
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe('b')
  })

  it('resets the timer when the value changes before the delay ends', () => {
    const { result, rerender } = renderHook(
      ({ v }) => useDebouncedValue(v, 400),
      { initialProps: { v: 'a' } },
    )
    rerender({ v: 'b' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ v: 'c' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('c')
  })
})
