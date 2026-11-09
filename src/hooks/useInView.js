import { useEffect, useRef, useState } from 'react'

// Reveal-on-scroll: becomes true the first time the element enters the viewport, then stops observing.
export default function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
