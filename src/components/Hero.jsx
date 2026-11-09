import { useEffect, useRef, useState } from 'react'

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    // Link-checking cost grows with the square of the count, so small screens get fewer particles.
    const count = Math.min(70, Math.round((W * H) / 14000))
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
    }))
    const paint = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(246,201,14,${p.alpha})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(246,201,14,${0.05 * (1 - d / 130)})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
    }

    let raf = 0
    const tick = () => {
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      })
      paint()
      raf = requestAnimationFrame(tick)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    // Resizing a canvas clears it, so a static (reduced-motion) canvas must be repainted.
    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      if (reduceMotion) paint()
    }
    window.addEventListener('resize', resize)

    // Only animate while the hero is on screen; visitors spend most of their time below it.
    let observer
    if (reduceMotion) {
      paint()
    } else {
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
      observer.observe(canvas)
    }

    return () => {
      stop()
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}

export default function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Grid */}
      <div className="absolute -inset-20 grid-bg animate-grid-drift opacity-50" />
      <ParticleCanvas />
      {/* Scan line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F6C90E]/25 to-transparent pointer-events-none animate-scan" />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_55%_50%,rgba(246,201,14,0.04),transparent)] pointer-events-none" />
      {/* Left accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-40 w-px bg-[#F6C90E]/60" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 border-t border-l border-[#F6C90E]" />

      {/* Corner meta */}
      <div className="hidden md:block absolute top-8 right-8 font-mono text-[12px] text-[#F6C90E]/80 text-right leading-relaxed">
        <div>VERSION::2026.11</div>
        <div>ENV::REACT + VITE</div>
        <div className="animate-pulse-y">STATUS::OPEN TO WORK</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16 pt-16 pb-20">
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Pre-label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F6C90E]" />
            <span className="sys-label">MY PORTFOLIO // 2026</span>
            <div className="w-2 h-2 bg-[#F6C90E] rounded-full animate-pulse-y" />
          </div>

          {/* Name */}
          <h1 className="font-display font-black leading-none mb-2">
            <span className="block text-[clamp(2.5rem,8vw,7rem)] tracking-tight select-none"
              style={{ color: 'transparent', WebkitTextStroke: '1.2px rgba(246,201,14,0.15)' }}>
              DEVELOPER
            </span>
            <span
              className="block text-[clamp(3rem,11vw,9.5rem)] tracking-tight text-[#ff6600] glitch-text [word-break:keep-all] -mt-3 lg:-mt-6"
              data-text="REGINALD レジ"
              style={{ textShadow: '0 0 60px rgba(246,201,14,0.12)' }}
            >
              REGINALD レジ
            </span>
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5 mb-10">
            {['FULL-STACK', 'REST APIs', 'WEB DEVELOPER', 'SOFTWARE DESIGN'].map(t => (
              <span key={t} className="px-3 py-1 border border-[#F6C90E]/25 text-[#F6C90E]/80 font-mono text-xs tracking-widest">
                {t}
              </span>
            ))}
          </div>

          <p className="max-w-xl text-[#EEEEEE]/70 text-base lg:text-lg leading-relaxed mb-12">
            BS Information Technology graduate, Major in Web Development with internship experience handling REST APIs and
            building UI components using React.js and Tailwind CSS. Led and developed a deployed web-based Cat adoption
            system as capstone project with Google OAuth sign-in and OpenAI Vision API integration. Also, provisions AWS
            infrastructure with Terraform (EC2, VPC, IAM, EBS).
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a href="#projects"
              className="relative px-8 py-3.5 bg-[#F6C90E] text-[#252C33] font-display font-bold tracking-[0.12em] text-sm hover:bg-[#FFD740] transition-colors overflow-hidden group">
              <span className="relative z-10">VIEW WORK</span>
              <div className="absolute inset-0 bg-white/15 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </a>
            <a href="#contact"
              className="px-8 py-3.5 border border-[#F6C90E]/45 text-[#F6C90E] font-display font-bold tracking-[0.12em] text-sm hover:border-[#F6C90E] hover:bg-[#F6C90E]/5 transition-all">
              GET IN TOUCH
            </a>
          </div>
        </div>

      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="sys-label text-[#F6C90E]/80">SCROLL</div>
        <div className="w-px h-8 bg-gradient-to-b from-[#F6C90E]/50 to-transparent" />
      </div>
    </section>
  )
}
