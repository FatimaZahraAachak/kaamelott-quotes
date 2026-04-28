import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'

let observeMock: ReturnType<typeof vi.fn>
let disconnectMock: ReturnType<typeof vi.fn>
let triggerIntersect: (isIntersecting: boolean) => void

beforeEach(() => {
  observeMock = vi.fn()
  disconnectMock = vi.fn()
  class MockIntersectionObserver {
    observe = observeMock
    disconnect = disconnectMock
    unobserve = vi.fn()
    takeRecords = vi.fn()
    constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
      triggerIntersect = (isIntersecting) => cb([{ isIntersecting }])
    }
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

function makeRef() {
  const ref = createRef<HTMLDivElement>()
  Object.defineProperty(ref, 'current', {
    value: document.createElement('div'),
  })
  return ref
}

describe('useIntersectionObserver', () => {
  it('does nothing when enabled is false', () => {
    renderHook(() =>
      useIntersectionObserver(makeRef(), {
        enabled: false,
        onIntersect: vi.fn(),
      }),
    )
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('observes the element when enabled is true', () => {
    renderHook(() =>
      useIntersectionObserver(makeRef(), {
        enabled: true,
        onIntersect: vi.fn(),
      }),
    )
    expect(observeMock).toHaveBeenCalledTimes(1)
  })

  it('calls onIntersect when the element enters the viewport', () => {
    const onIntersect = vi.fn()
    renderHook(() =>
      useIntersectionObserver(makeRef(), { enabled: true, onIntersect }),
    )
    triggerIntersect(true)
    expect(onIntersect).toHaveBeenCalledTimes(1)
  })

  it('does not call onIntersect when isIntersecting is false', () => {
    const onIntersect = vi.fn()
    renderHook(() =>
      useIntersectionObserver(makeRef(), { enabled: true, onIntersect }),
    )
    triggerIntersect(false)
    expect(onIntersect).not.toHaveBeenCalled()
  })

  it('calls disconnect on unmount', () => {
    const { unmount } = renderHook(() =>
      useIntersectionObserver(makeRef(), {
        enabled: true,
        onIntersect: vi.fn(),
      }),
    )
    unmount()
    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})
