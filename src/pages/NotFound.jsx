import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({ title: 'Page not found — Reginald Unisa' })

  return (
    <main id="main" tabIndex={-1} className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
      <p className="sys-label">ERROR::404</p>
      <h1 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-[#EEEEEE] tracking-tight leading-none">
        PAGE <span className="text-[#F6C90E]">NOT FOUND</span>
      </h1>
      <Link to="/" className="px-8 py-3.5 border border-[#F6C90E]/45 text-[#F6C90E] font-display font-bold tracking-[0.12em] text-sm hover:border-[#F6C90E] hover:bg-[#F6C90E]/5 transition-all">
        BACK TO HOME
      </Link>
    </main>
  )
}
