import { useState, useEffect } from 'react'

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [ring, setRing] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    let ringX = -100, ringY = -100
    let animFrame

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
    }

    const animate = () => {
      ringX += (pos.x - ringX) * 0.12
      ringY += (pos.y - ringY) * 0.12
      setRing({ x: ringX, y: ringY })
      animFrame = requestAnimationFrame(animate)
    }

    const onEnter = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setHovering(true)
    }
    const onLeave = () => setHovering(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)
    animFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(animFrame)
    }
  }, [pos.x, pos.y])

  return (
    <>
      <div className="cursor-dot" style={{ left: pos.x, top: pos.y }} />
      {/* <div className={`cursor-ring ${hovering ? 'hovering' : ''}`} style={{ left: ring.x, top: ring.y }} /> */}
    </>
  )
}
