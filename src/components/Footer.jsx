export default function Footer() {
  return (
    <footer className="border-t border-[#F6C90E]/10 py-10 bg-[#1E242A]">
      <div className="max-w-6xl mx-auto px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border border-[#F6C90E]/40 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#F6C90E]" style={{ clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
          </div>
          <span className="font-display font-bold tracking-widest text-sm text-[#EEEEEE]/40">ALEX MERCER</span>
        </div>
        <div className="sys-label text-[#EEEEEE]/20">SYS::2025 // ALL RIGHTS RESERVED</div>
        <div className="flex gap-3">
          {['GH','LI','TW'].map(s => (
            <a key={s} href="#" className="w-7 h-7 border border-[#F6C90E]/15 flex items-center justify-center font-mono text-[10px] text-[#EEEEEE]/35 hover:border-[#F6C90E]/45 hover:text-[#F6C90E] transition-all">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
