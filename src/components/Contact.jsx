import { useState } from 'react'
import useInView from '../hooks/useInView'

const EMAIL = 'reginald.unisa.p@gmail.com'

const fieldClass = 'w-full bg-[#252C33] border border-[#F6C90E]/20 text-[#EEEEEE] px-4 py-3 text-sm focus:border-[#F6C90E] placeholder-[#EEEEEE]/60 font-mono transition-colors'

const socials = [
  { label:'GITHUB',    handle:'https://github.com/iStrafe',       href:'https://github.com/iStrafe' },
  { label:'LINKEDIN',  handle:'https://www.linkedin.com/in/reginaldu/',     href:'https://www.linkedin.com/in/reginaldu/' },
  { label:'FACEBOOK', handle:'@iTachyon',       href:'https://www.facebook.com/iTachyon' },
  { label:'EMAIL',     handle:EMAIL,  href:`mailto:${EMAIL}` },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  // There is no backend, so the form opens a pre-filled draft in the visitor's own email app.
  // encodeURIComponent keeps line breaks and & in the message from altering the mailto URL.
  const submit = e => {
    e.preventDefault()
    const subject = `Portfolio inquiry from ${form.name}`
    const body = `${form.message}\n\nFrom: ${form.name} <${form.email}>`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_90%,rgba(246,201,14,0.04),transparent)] pointer-events-none" />
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/80">SECTION::05 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none">
            OPEN <span className="text-[#F6C90E]">CHANNEL</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className={`lg:col-span-2 min-w-0 space-y-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-[#EEEEEE]/70 text-base leading-relaxed">
              Available for freelance projects, full-time roles, and consulting engagements. Response within 24–48 hours.
            </p>
            <div className="space-y-3">
              {socials.map(s => (
                <a key={s.label} href={s.href}
                  className="flex items-center justify-between gap-3 group border border-[#F6C90E]/10 bg-[#303841] px-4 py-3 hover:border-[#F6C90E]/40 transition-all">
                  <div className="min-w-0">
                    <div className="sys-label mb-0.5 text-[#F6C90E]/80">{s.label}</div>
                    <div className="text-[#EEEEEE] text-sm break-words group-hover:text-[#F6C90E] transition-colors">{s.handle}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="flex-shrink-0 text-[#EEEEEE]/70 group-hover:text-[#F6C90E] group-hover:translate-x-1 transition-all">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border border-[#44EEA0]/20 bg-[#44EEA0]/5">
              <div className="w-2 h-2 rounded-full bg-[#44EEA0] animate-pulse" />
              <div>
                <div className="sys-label text-[#44EEA0]/80">AVAILABILITY</div>
                <div className="text-[#44EEA0] text-sm">Open to new projects</div>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-3 min-w-0 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {sent ? (
              <div role="status" className="relative border border-[#44EEA0]/30 bg-[#44EEA0]/5 p-10 text-center">
                <div className="font-display font-black text-3xl text-[#44EEA0] mb-2">ALMOST THERE</div>
                <p className="text-[#EEEEEE]/70 mt-4 text-sm leading-relaxed">
                  Your email app should have opened with this message filled in. Press send there to reach me.
                  If nothing opened, write to me at{' '}
                  <a href={`mailto:${EMAIL}`} className="text-[#F6C90E] underline break-words">{EMAIL}</a>.
                </p>
                <button type="button" onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2.5 border border-[#F6C90E]/45 text-[#F6C90E] font-display font-bold tracking-[0.12em] text-sm hover:border-[#F6C90E] hover:bg-[#F6C90E]/5 transition-all">
                  EDIT MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="relative border border-[#F6C90E]/15 bg-[#303841] p-8 space-y-5">
                <div className="hud-corner tl" /><div className="hud-corner tr" />
                <div className="hud-corner bl" /><div className="hud-corner br" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="sys-label block mb-2">DESIGNATION</label>
                    <input id="contact-name" name="name" autoComplete="name" maxLength={100} value={form.name} onChange={handle} required placeholder="Your name"
                      className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sys-label block mb-2">COMM CHANNEL</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={handle} required placeholder="your@email.com"
                      className={fieldClass} />
                  </div>
                </div>
                <div>
                  {/* maxLength keeps the mailto URL under the roughly 2000 characters mail apps accept */}
                  <label htmlFor="contact-message" className="sys-label block mb-2">TRANSMISSION</label>
                  <textarea id="contact-message" name="message" maxLength={1200} value={form.message} onChange={handle} required rows={5} placeholder="Describe your project or inquiry..."
                    className={`${fieldClass} resize-none`} />
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#F6C90E] text-[#252C33] font-display font-bold tracking-[0.15em] text-sm hover:bg-[#FFD740] transition-colors relative overflow-hidden group">
                  <span className="relative z-10">OPEN EMAIL DRAFT</span>
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
