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

const socials = [
  { label:'GITHUB',    handle:'https://github.com/iStrafe',       href:'https://github.com/iStrafe' },
  { label:'LINKEDIN',  handle:'https://www.linkedin.com/in/istrafe/',     href:'https://www.linkedin.com/in/istrafe/' },
  { label:'FACEBOOK', handle:'@iTachyon',       href:'https://www.facebook.com/iTachyon' },
  { label:'EMAIL',     handle:'yugotabata@gmail.com',  href:'yugotabata@gmail.com' },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }

  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_90%,rgba(246,201,14,0.04),transparent)] pointer-events-none" />
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/50">SECTION::05 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none">
            OPEN <span className="text-[#F6C90E]">CHANNEL</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-[#EEEEEE]/55 text-base leading-relaxed">
              Available for freelance projects, full-time roles, and consulting engagements. Response within 24–48 hours.
            </p>
            <div className="space-y-3">
              {socials.map(s => (
                <a key={s.label} href={s.href}
                  className="flex items-center justify-between group border border-[#F6C90E]/10 bg-[#303841] px-4 py-3 hover:border-[#F6C90E]/40 transition-all">
                  <div>
                    <div className="sys-label mb-0.5 text-[#F6C90E]/50">{s.label}</div>
                    <div className="text-[#EEEEEE] text-sm group-hover:text-[#F6C90E] transition-colors">{s.handle}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#EEEEEE]/30 group-hover:text-[#F6C90E] group-hover:translate-x-1 transition-all">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border border-[#44EEA0]/20 bg-[#44EEA0]/5">
              <div className="w-2 h-2 rounded-full bg-[#44EEA0] animate-pulse" />
              <div>
                <div className="sys-label text-[#44EEA0]/80">AVAILABILITY</div>
                <div className="text-[#44EEA0] text-sm">Open to new projects — Q1 2025</div>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {sent ? (
              <div className="relative border border-[#44EEA0]/30 bg-[#44EEA0]/5 p-10 text-center">
                <div className="font-display font-black text-3xl text-[#44EEA0] mb-2">MESSAGE RECEIVED</div>
                <div className="sys-label text-[#44EEA0]/60">TRANSMISSION ID: {Math.random().toString(36).slice(2,10).toUpperCase()}</div>
                <p className="text-[#EEEEEE]/50 mt-4 text-sm">I'll get back to you within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="relative border border-[#F6C90E]/15 bg-[#303841] p-8 space-y-5">
                <div className="hud-corner tl" /><div className="hud-corner tr" />
                <div className="hud-corner bl" /><div className="hud-corner br" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="sys-label block mb-2">DESIGNATION</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="Your name"
                      className="w-full bg-[#252C33] border border-[#F6C90E]/20 text-[#EEEEEE] px-4 py-3 text-sm focus:outline-none focus:border-[#F6C90E]/50 placeholder-[#EEEEEE]/20 font-mono transition-colors" />
                  </div>
                  <div>
                    <label className="sys-label block mb-2">COMM CHANNEL</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="your@email.com"
                      className="w-full bg-[#252C33] border border-[#F6C90E]/20 text-[#EEEEEE] px-4 py-3 text-sm focus:outline-none focus:border-[#F6C90E]/50 placeholder-[#EEEEEE]/20 font-mono transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="sys-label block mb-2">TRANSMISSION</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Describe your project or inquiry..."
                    className="w-full bg-[#252C33] border border-[#F6C90E]/20 text-[#EEEEEE] px-4 py-3 text-sm focus:outline-none focus:border-[#F6C90E]/50 placeholder-[#EEEEEE]/20 font-mono resize-none transition-colors" />
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#F6C90E] text-[#252C33] font-display font-bold tracking-[0.15em] text-sm hover:bg-[#FFD740] transition-colors relative overflow-hidden group">
                  <span className="relative z-10">SEND TRANSMISSION</span>
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
