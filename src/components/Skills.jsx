import { useEffect, useRef, useState } from 'react'

function useInView(t = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: t })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [t])
  return [ref, inView]
}

const groups = [
  { group:'FRONTEND',  icon:'⬡', skills:[{n:'React / Next.js',p:60},{n:'CSS / Tailwind',p:20},{n:'Bootstrap',p:20}] },
  { group:'BACKEND',   icon:'◈', skills:[{n:'Node.js / Express',p:30},{n:'Laravel / PHP',p:60},{n:'C#',p:10}] },
  { group:'DATA / DB', icon:'▣', skills:[{n:'MySQL',p:50},{n:'MongoDB',p:50}] },
  { group:'CLOUD',     icon:'◬', skills:[{n:'AWS',p:20},{n:'Hostinger',p:60},{n:'CI/CD',p:20}] },
]

const tools = ['VS Code','Figma','Git','Postman','Mongodb','Figma','Adobe XD','Vercel','Cloudflare','GitHub Actions']

export default function Skills() {
  const [ref, inView] = useInView()
  return (
    <section id="skills" className="relative py-32">
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/50">SECTION::04 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none">
            TECH <span className="text-[#f6670e]">ARSENAL</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {groups.map((g, gi) => (
            <div key={g.group}
              className={`relative border border-[#F6C90E]/10 bg-[#303841] p-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${gi * 100}ms` }}>
              <div className="hud-corner tl" />
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#ff5e00]">{g.icon}</span>
                <span className="sys-label">{g.group}</span>
              </div>
              {g.skills.map(s => (
                <div key={s.n} className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[#EEEEEE]/65 text-sm">{s.n}</span>
                    <span className="font-mono text-[#ffcc00] text-xs">{s.p}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: inView ? `${s.p}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={`transition-all duration-700 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-5">
            <div className="sys-label text-[#F6C90E]/50">TOOLS</div>
            <div className="flex-1 h-px bg-[#F6C90E]/10" />
          </div>
          <div className="flex flex-wrap gap-3">
            {tools.map(t => (
              <span key={t} className="px-4 py-2 bg-[#303841] border border-[#F6C90E]/10 text-[#EEEEEE]/45 font-mono text-xs hover:border-[#F6C90E]/40 hover:text-[#EEEEEE] transition-all cursor-default">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
