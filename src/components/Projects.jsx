import { useEffect, useRef, useState } from 'react'

function useInView(t = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: t })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [t])
  return [ref, inView]
}

const projects = [
  { id:'001', title:'AdU-Cats: Web Adoption System', category:'FULLSTACK', desc:'A Dedicated website for Aducats Organization focusing on streamlining cat adoptions. With AI-Powered breed prediction', tech:['Laravel','Vite','MySQL','Hostinger','Vanilla JS', 'Tailwind'], accent:'#F6C90E' },
  
]

function Card({ p, i, inView }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="project-card relative"
      style={{ transition: `all 0.6s ease ${i * 70}ms`, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div className={`project-card-inner h-full border p-6 bg-[#303841] transition-all duration-300 ${hov ? 'border-[rgba(246,201,14,0.45)]' : 'border-[rgba(246,201,14,0.1)]'}`}
        style={{ boxShadow: hov ? `0 0 28px rgba(246,201,14,0.07)` : 'none' }}>
        <div className="hud-corner tl" />
        <div className="hud-corner br" />

        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-[10px] text-[#EEEEEE]/30">PRJ::{p.id}</span>
          <span className="font-mono text-[10px] px-2 py-0.5 border"
            style={{ borderColor: `${p.accent}30`, color: p.accent }}>
            {p.category}
          </span>
        </div>

        <h3 className="font-display font-black text-2xl text-[#EEEEEE] tracking-wide mb-3">{p.title}</h3>

        {/* Accent line */}
        <div className="mb-4 h-px overflow-hidden bg-[rgba(246,201,14,0.08)]">
          <div className="h-full transition-all duration-500" style={{ background: p.accent, width: hov ? '100%' : '0%' }} />
        </div>

        <p className="text-[#EEEEEE]/45 text-sm leading-relaxed mb-6">{p.desc}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {p.tech.map(t => (
            <span key={t} className="font-mono text-[10px] px-2 py-0.5 bg-[#3A4750] text-[#EEEEEE]/50 border border-[#EEEEEE]/8">{t}</span>
          ))}
        </div>

        <div className="flex gap-5">
          <a href="#" className="flex items-center gap-1.5 text-[#EEEEEE]/40 hover:text-[#EEEEEE] transition-colors font-display text-xs tracking-wider">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            DEMO NO LONGER AVAILABLE
          </a>
          {/* <a href="#" className="flex items-center gap-1.5 text-[#EEEEEE]/40 hover:text-[#EEEEEE] transition-colors font-display text-xs tracking-wider">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C3.24 1 1 3.24 1 6c0 2.21 1.43 4.08 3.41 4.75-.05-.42-.09-1.07.02-1.53l.66-2.78s-.17-.34-.17-.83c0-.78.45-1.36.99-1.36.47 0 .69.35.69.78 0 .47-.3 1.18-.46 1.84-.13.55.28 1 .82 1 .98 0 1.64-1.04 1.64-2.54 0-1.33-.95-2.26-2.32-2.26-1.58 0-2.5 1.18-2.5 2.4 0 .48.18.99.41 1.27a.16.16 0 01.04.16l-.15.62c-.02.1-.08.12-.17.07-.7-.33-1.14-1.35-1.14-2.17 0-1.76 1.28-3.38 3.7-3.38 1.94 0 3.45 1.38 3.45 3.23 0 1.93-1.21 3.48-2.9 3.48-.57 0-1.1-.3-1.28-.64l-.35 1.29c-.13.49-.47 1.1-.7 1.47A5 5 0 106 1z" fill="currentColor"/></svg>
            SOURCE
          </a> */}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView()
  const [filter, setFilter] = useState('ALL')
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-32">
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/50">SECTION::03 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none mb-6">
            FIELD <span className="text-[#F6C90E]">PROJECTS</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {['ALL', ...new Set(projects.map(p => p.category))].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`font-display text-xs tracking-widest px-3 py-1.5 border transition-all ${filter === cat ? 'border-[#F6C90E] text-[#F6C90E] bg-[#F6C90E]/5' : 'border-[#F6C90E]/20 text-[#EEEEEE]/45 hover:border-[#F6C90E]/40 hover:text-[#EEEEEE]/70'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => <Card key={p.id} p={p} i={i} inView={inView} />)}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <button className="relative px-10 py-3 border border-[#F6C90E]/25 text-[#EEEEEE]/50 font-display tracking-widest text-sm hover:border-[#F6C90E]/50 hover:text-[#F6C90E] transition-all">
            <div className="hud-corner tl" style={{ width: 6, height: 6 }} />
            <div className="hud-corner br" style={{ width: 6, height: 6 }} />
            LOAD MORE PROJECTS
          </button>
        </div>
      </div>
    </section>
  )
}
