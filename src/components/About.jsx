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

const timeline = [
  { year: '2023', role: 'Database Specialist', company: 'Adamson University', desc: 'Earned Specialist in Databases Certificate using Mysql, MSSql, and Mongodb.' },
  { year: '2024', role: 'Full-Stack Dev', company: 'Capstone Project - Adu:Cats Website', desc: 'Developed an AI-assisted cat breed recognition feature by Integrating OpanAIs Vision API, enabling breed prediction from uploaded image.' },
  { year: '2025', role: 'Software Engineer Intern', company: '7th Pillar Integration systems corp.', desc: 'Participated in meetings with foreign investors to present UI and Incorporate stakeholder feedbacks into UI revisions' },
]

export default function About() {
  const [ref, inView] = useInView()
  return (
    <section id="about" className="relative py-32">
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-20 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/50">SECTION::02 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none">
            ABOUT <span className="text-[#F6C90E]">PROTOCOL</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Bio card */}
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative border border-[#F6C90E]/15 p-8 bg-[#080800]">
              <div className="hud-corner tl" /><div className="hud-corner tr" />
              <div className="hud-corner bl" /><div className="hud-corner br" />
              <p className="text-[#EEEEEE]/75 leading-relaxed text-base lg:text-lg mb-6">
                I'm a full-stack developer who is passionate about creating user centered design and scalable applications.
                My work revolves in Model-View-Controller architecture for a maintanable and scalable code base.
              </p>
              <p className="text-[#EEEEEE]/45 leading-relaxed text-sm">
                When I'm not building, I'm spending my time solving Leetcode or Hackerank Questions to improve my problem solving and Data Structure Skills.

              </p>
              <div className="mt-8 pt-6 border-t border-[#F6C90E]/10 grid grid-cols-2 gap-4">
                {[['LOCATION','Philippines, Manila'],['TIMEZONE','UTC+8 (PH)'],['AVAILABILITY','Open to roles'],['LANGUAGES','EN, FIL']].map(([k,v]) => (
                  <div key={k}>
                    <div className="sys-label mb-1">{k}</div>
                    <div className="text-[#EEEEEE] text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <a href="#" className="inline-flex items-center gap-3 group mt-6">
              <div className="w-10 h-10 border border-[#F6C90E]/35 flex items-center justify-center group-hover:bg-[#F6C90E]/8 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v9M4 7l4 4 4-4M2 14h12" stroke="#F6C90E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-semibold tracking-widest text-sm text-[#EEEEEE]/50 group-hover:text-[#F6C90E] transition-colors">DOWNLOAD CV</span>
            </a>
          </div>

          {/* Timeline */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="sys-label mb-6 text-[#F6C90E]/50">EXPERIENCE LOG</div>
            {timeline.map((item, i) => (
              <div key={i} className="relative flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 border border-[#F6C90E] bg-[#252C33] mt-1.5 flex-shrink-0 group-hover:bg-[#F6C90E] transition-colors"
                    style={{ clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-[#F6C90E]/15 mt-1" />}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[#F6C90E] text-xs">{item.year}</span>
                    <div className="w-4 h-px bg-[#F6C90E]/25" />
                    <span className="text-[#EEEEEE] font-display font-semibold tracking-wide text-sm">{item.role}</span>
                  </div>
                  <div className="sys-label mb-2 text-[#EEEEEE]/35">{item.company}</div>
                  <p className="text-[#EEEEEE]/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
