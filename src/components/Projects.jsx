import { useState } from 'react'
import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'

const projects = [
  { id:'001', title:'AdU-Cats: Web Adoption System', category:'FULLSTACK', desc:'A Dedicated website for Aducats Organization focusing on streamlining cat adoptions. With AI-Powered breed prediction', tech:['Laravel','Vite','MySQL','Hostinger','Vanilla JS', 'Tailwind'], accent:'#F6C90E' },
  { id:'002', title:'Minecraft on AWS EC2', category:'CLOUD / DEVOPS', desc:'A private Minecraft server for five friends, built entirely with Terraform on one ARM EC2 instance in Singapore. It runs only while people play, powers itself off when idle, and snapshots its world every night for about $2 a month while stopped.', tech:['AWS EC2','Terraform','EBS','DLM','IAM Identity Center','systemd','Linux'], accent:'#F6C90E', details:'/projects/minecraft-ec2', privateRepo:true },
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
          <span className="font-mono text-[10px] text-[#EEEEEE]/70">PRJ::{p.id}</span>
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

        <p className="text-[#EEEEEE]/70 text-sm leading-relaxed mb-6">{p.desc}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {p.tech.map(t => (
            <span key={t} className="font-mono text-[10px] px-2 py-0.5 bg-[#3A4750] text-[#EEEEEE]/70 border border-[#EEEEEE]/8">{t}</span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {p.details ? (
            <Link to={p.details} className="flex items-center gap-1.5 text-[#F6C90E]/80 hover:text-[#F6C90E] transition-colors font-display text-xs tracking-wider">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              VIEW DETAILS
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 text-[#EEEEEE]/70 font-display text-xs tracking-wider">
              DEMO NO LONGER AVAILABLE
            </span>
          )}
          {p.privateRepo && (
            <span className="flex items-center gap-1.5 text-[#EEEEEE]/70 font-mono text-[10px] tracking-wider">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2.5" y="5.5" width="7" height="5" /><path d="M4 5.5V4a2 2 0 014 0v1.5" /></svg>
              PRIVATE REPO
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView(0.1)
  const [filter, setFilter] = useState('ALL')
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-32">
      <div ref={ref} className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className={`mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-label text-[#F6C90E]/80">SECTION::03 /////</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
          </div>
          <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none mb-6">
            FIELD <span className="text-[#F6C90E]">PROJECTS</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {['ALL', ...new Set(projects.map(p => p.category))].map(cat => (
              <button key={cat} type="button" onClick={() => setFilter(cat)} aria-pressed={filter === cat}
                className={`font-display text-xs tracking-widest px-3 py-1.5 border transition-all ${filter === cat ? 'border-[#F6C90E] text-[#F6C90E] bg-[#F6C90E]/5' : 'border-[#F6C90E]/20 text-[#EEEEEE]/70 hover:border-[#F6C90E]/40 hover:text-[#EEEEEE]/70'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => <Card key={p.id} p={p} i={i} inView={inView} />)}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <button className="relative px-10 py-3 border border-[#F6C90E]/25 text-[#EEEEEE]/70 font-display tracking-widest text-sm hover:border-[#F6C90E]/50 hover:text-[#F6C90E] transition-all">
            <div className="hud-corner tl" style={{ width: 6, height: 6 }} />
            <div className="hud-corner br" style={{ width: 6, height: 6 }} />
            LOAD MORE PROJECTS
          </button>
        </div>
      </div>
    </section>
  )
}
