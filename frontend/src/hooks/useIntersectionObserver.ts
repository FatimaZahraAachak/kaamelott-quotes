import { useEffect } from 'react'

type Options = {
  enabled: boolean
  onIntersect: () => void
}

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  { enabled, onIntersect }: Options
) {
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect()
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, enabled, onIntersect])
}
