import { useEffect, useRef } from 'react'

// Writes straight to the DOM: storing the position in state would re-render on every mouse move.
export default function Cursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    // Touch screens have no pointer to follow, so they keep the browser defaults.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const root = document.documentElement
    root.classList.add('custom-cursor')

    const onMove = (e) => {
      const dot = dotRef.current
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      dot.style.opacity = '1'
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      root.classList.remove('custom-cursor')
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
