import { useState } from 'react'

const TECH = [
  {
    name: 'Node.JS',
    color: '#68A063',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.605.065-.037.151-.023.218.016l2.256 1.338c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.085.05-.139.145-.139.243v10.148c0 .097.055.191.137.237l2.409 1.391c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L1.897 18.67c-.57-.329-.922-.943-.922-1.604V6.921c0-.659.352-1.273.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.33.924.944.924 1.603v10.145c0 .659-.354 1.273-.924 1.604l-8.794 5.076c-.281.163-.601.247-.922.247h-.62zm2.719-6.993c-3.855 0-4.663-1.77-4.663-3.254 0-.141.115-.253.256-.253h1.138c.127 0 .233.092.253.217.172 1.161.684 1.748 3.018 1.748 1.858 0 2.649-.42 2.649-1.407 0-.568-.225-.99-3.114-1.273-2.416-.238-3.908-.772-3.908-2.708 0-1.782 1.503-2.845 4.022-2.845 2.829 0 4.228.981 4.405 3.089.006.073-.018.143-.065.196-.047.052-.113.082-.182.082h-1.142c-.12 0-.225-.084-.251-.2-.277-1.225-.946-1.619-2.765-1.619-2.036 0-2.273.709-2.273 1.241 0 .644.281.832 3.02 1.195 2.713.36 3.999.871 3.999 2.773 0 1.924-1.603 3.019-4.397 3.019h-.001z"/>
      </svg>
    ),
  },
  {
    name: 'Laravel',
    color: '#FF2D20',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.642 5.43a.364.364 0 01.014.1v5.149a.372.372 0 01-.185.322l-4.312 2.49v4.934a.375.375 0 01-.186.322L9.25 23.486a.5.5 0 01-.078.033.28.28 0 01-.083.013.28.28 0 01-.084-.013.5.5 0 01-.077-.033L.686 18.752a.375.375 0 01-.186-.322V8.825a.376.376 0 01.186-.321l4.312-2.49V1.08a.375.375 0 01.186-.322L14.28.013a.372.372 0 01.078-.033A.5.5 0 0114.442 0a.5.5 0 01.083.013.5.5 0 01.077.033l8.812 5.108a.37.37 0 01.228.276zM9.17 22.481l8.31-4.801V12.74l-4.125 2.384a.375.375 0 01-.185.051.375.375 0 01-.185-.051L4.67 10.14V4.824L.874 7.128v9.421l8.296 4.932zm4.312-16.138l-7.73 4.47 7.73 4.47 7.729-4.47-7.729-4.47zm-4.498 10.29L5.046 13.43 1.05 11.084v9.253l8.296 4.932v-8.536h-.362zm9.157-5.25l-3.986 2.303v8.536l4.312-2.49V12.74l-.326-.188v-.001z"/>
      </svg>
    ),
  },
  {
    name: 'C#',
    color: '#9B4F96',
    imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    icon: null,
  },
  {
    name: 'MongoDB',
    color: '#4EA94B',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.154-1.86-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/>
      </svg>
    ),
  },
  {
    name: 'MySQL',
    color: '#4479A1',
    imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    icon: null,
  },
  {
    name: 'Tailwind',
    color: '#06B6D4',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
]

export default function TechCarousel() {
  const [paused, setPaused] = useState(false)

  return (
    <>
      {/* Inject keyframe directly — guaranteed to work regardless of Tailwind purging */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <section className="py-16 relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #252C33 0%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #252C33 0%, transparent 100%)' }} />

        {/* Header */}
        <div className="px-8 lg:px-16 mb-10">
          <div className="flex items-center gap-4">
            <div className="sys-label text-[#F6C90E]/60">TECH STACK</div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/20 to-transparent" />
            <span className="font-mono text-[10px] text-[#F6C90E]/30 pr-4">HOVER TO PAUSE</span>
          </div>
        </div>

        {/* Single track with items duplicated — animates -50% for a seamless loop */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              width: 'max-content',
              animation: 'marquee-scroll 22s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {[...TECH, ...TECH].map((tech, i) => (
              <Pill key={i} tech={tech} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Pill({ tech }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 28px',
        border: `1px solid ${hov ? tech.color + 'BB' : 'rgba(246,201,14,0.18)'}`,
        background: hov ? `${tech.color}0D` : 'rgba(58,71,80,0.5)',
        whiteSpace: 'nowrap',
        cursor: 'default',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        boxShadow: hov
          ? `0 0 22px ${tech.color}44, inset 0 0 16px ${tech.color}11`
          : 'none',
        flexShrink: 0,
      }}
    >
      {tech.imgSrc ? (
        <img
          src={tech.imgSrc}
          width="36"
          height="36"
          alt={tech.name}
          style={{ opacity: hov ? 1 : 0.65, transition: 'opacity 0.25s', display: 'block' }}
        />
      ) : (
        <span style={{ color: hov ? tech.color : tech.color + 'AA', transition: 'color 0.25s', display: 'flex' }}>
          {tech.icon}
        </span>
      )}
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: '1.15rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: hov ? '#EEEEEE' : 'rgba(238,238,238,0.6)',
        transition: 'color 0.25s',
      }}>
        {tech.name}
      </span>
    </div>
  )
}
