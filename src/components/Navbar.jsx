import { useState, useEffect } from 'react'

const navLinks = [
  {
    label: 'Home', href: '#home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M7 18V12h6v6"/>
      </svg>
    ),
  },
  {
    label: 'About', href: '#about',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="3"/>
        <path d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
      </svg>
    ),
  },
  {
    label: 'Projects', href: '#projects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="7" height="7" rx="1"/>
        <rect x="11" y="3" width="7" height="7" rx="1"/>
        <rect x="2" y="12" width="7" height="7" rx="1"/>
        <rect x="11" y="12" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Skills', href: '#skills',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,14 7,9 11,13 18,5"/>
        <polyline points="14,5 18,5 18,9"/>
      </svg>
    ),
  },
  {
    label: 'Contact', href: '#contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="13" rx="1.5"/>
        <path d="M2 7l8 5 8-5"/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top
        if (top <= 120 && top > -sec.offsetHeight + 120) setActive(sec.id)
      })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="sidebar group/nav">
      {/* Logo mark */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(246,201,14,0.1)] flex-shrink-0">
        <div className="w-7 h-7 flex-shrink-0 border border-[#F6C90E]/50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#F6C90E]" style={{ clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
        </div>
        <span className="sidebar-label text-[#F6C90E] tracking-[0.25em] text-s">REG.DEV</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex flex-col justify-center gap-1 py-6">
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`sidebar-link ${active === link.href.slice(1) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Bottom: social icons */}
      <div className="border-t border-[rgba(246,201,14,0.1)] px-4 py-5 flex flex-col gap-3">
        {[
          { label: 'GitHub', href: 'https://github.com/iStrafe', icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          )},
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/istrafe/', icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          )},
        ].map(s => (
          <a key={s.label} href={s.href} className="sidebar-link py-2 px-[18px]" title={s.label}>
            <span className="sidebar-icon">{s.icon}</span>
            <span className="sidebar-label">{s.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
