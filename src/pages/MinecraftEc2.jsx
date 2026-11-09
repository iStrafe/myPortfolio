import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'
import usePageMeta from '../hooks/usePageMeta'

/* ───────────────────────── Content ───────────────────────── */

const DIAGRAM = '/projects/minecraft-ec2/architecture.webp'

const STACK = ['Amazon EC2 t4g.medium', 'Amazon VPC', 'Amazon EBS gp3', 'Data Lifecycle Manager', 'IAM Identity Center', 'AWS Budgets', 'Terraform', 'Paper 1.20.1', 'systemd', 'Ubuntu 24.04 ARM64']

const META = [
  { k: 'REGION',         v: 'ap-southeast-1 (Singapore)' },
  { k: 'BUILT',          v: '11 - 25 Oct 2026 · 10 phases' },
  { k: 'INFRASTRUCTURE', v: 'Terraform · 16 resources' },
  { k: 'STATUS',         v: 'Live · runs on demand' },
]

const STATS = [
  { n: '~$2',   l: 'per month while stopped' },
  { n: '$0.05', l: 'per hour while running' },
  { n: '30 min', l: 'idle before auto-stop' },
  { n: '7',     l: 'daily encrypted snapshots' },
  { n: '16',    l: 'Terraform-managed resources' },
  { n: '5',     l: 'whitelisted player slots' },
]

const TOC = [
  ['overview', 'Overview'], ['architecture', 'Architecture'], ['decisions', 'Key decisions'],
  ['internals', 'Server internals'], ['specs', 'Specifications'], ['security', 'Security'],
  ['cost', 'Cost'], ['timeline', 'Build timeline'], ['drills', 'Incident drills'], ['lessons', 'Lessons'],
]

const HIGHLIGHTS = [
  { t: 'Infrastructure as code', d: 'VPC, subnet, routing, security group, instance, world disk, IAM role and backup policy are all Terraform: one plan, one apply, fully reproducible.' },
  { t: 'Pay only while playing', d: 'An on-instance timer powers the server off 30 minutes after the last player leaves. A forgotten server runs for 35 minutes at most.' },
  { t: 'Disposable compute, durable world', d: 'The world lives on its own encrypted EBS volume, so the instance can be replaced at any time without losing progress.' },
  { t: 'Recovery that has been tested', d: 'Nightly snapshots, plus incident drills that broke the server on purpose and proved that restoring from a snapshot works.' },
]

const FLOWS = [
  { f: 'Players',       p: 'Minecraft client → instance public IP → internet gateway → route table → security group (TCP 25565 from anywhere) → Paper. The whitelist and online-mode=true decide who can actually join.' },
  { f: 'Admin SSH',     p: 'Laptop (WSL) → internet gateway → security group (TCP 22 from a single /32 only) → OpenSSH with key-only login.' },
  { f: 'Control plane', p: 'SSO sign-in to IAM Identity Center returns 4-hour credentials. Terraform and the AWS CLI then call AWS APIs over HTTPS; nothing reaches the instance this way.' },
  { f: 'Backups',       p: 'DLM assumes a dedicated IAM role, selects volumes tagged Backup=minecraft-world, snapshots them daily at 20:00 UTC and keeps the newest 7.' },
  { f: 'Cost guard',    p: 'A $5/month AWS Budget sends email alerts at three thresholds. Auto-stop on the instance is the real control.' },
]

const NOT_IN_DESIGN = [
  ['No Elastic IP', 'it would bill while stopped. The public IP changes on each start instead.'],
  ['No load balancer, Auto Scaling or second AZ', 'there is one player group and one world. A failure is recovered from the latest snapshot.'],
  ['No RCON or SSH exposed to the world', 'RCON listens on localhost only.'],
  ['No CloudWatch alarm', 'the budget alert and auto-stop already cover the main risk, a server left running.'],
  ['No remote Terraform state', 'one person on one laptop. S3 state is a future option.'],
]

const DECISIONS = [
  { d: 'Region',          c: 'ap-southeast-1 (Singapore)',                    w: 'Lowest latency for the players' },
  { d: 'Instance',        c: 't4g.medium · 2 vCPU ARM Graviton2, 4 GiB RAM', w: 'Cheaper per CPU than x86 and enough for 5 players' },
  { d: 'Server software', c: 'Paper 1.20.1, vanilla gameplay',                w: 'Better performance than the vanilla jar, same game' },
  { d: 'Running model',   c: 'On only while playing; auto-stop after 30 min empty', w: 'Per-second billing only while in use' },
  { d: 'World storage',   c: 'Separate 8 GiB gp3 EBS volume',                 w: 'The server can be rebuilt without losing the world' },
  { d: 'Access',          c: 'SSH keys only, from one home IP (/32)',         w: 'No password logins, and SSH is not open to the internet' },
  { d: 'Identity',        c: 'IAM Identity Center (SSO), 4-hour credentials', w: 'No long-lived access keys on the laptop' },
  { d: 'Backups',         c: 'Daily EBS snapshots by DLM, 7 kept',            w: 'At most about 24 hours of progress at risk' },
  { d: 'Budget',          c: '$5/month alert, 3 email thresholds',            w: 'Covers about 2 hours of play a day on average' },
  { d: 'Source control',  c: 'Private GitHub repo, pushed over SSH',          w: 'Off-laptop copy of the code; secrets and state stay out' },
]

const BOOT_STEPS = [
  ['Packages',           'apt upgrade, then install OpenJDK 17 (headless)'],
  ['Wait for world disk', 'Poll the EBS device by ID for up to 5 minutes, because Terraform attaches it after boot'],
  ['Format only if empty', 'blkid check; mkfs.ext4 only when no filesystem exists, so an existing world is never wiped'],
  ['Mount by UUID',      'Add an fstab entry once (with nofail) and mount at /srv/minecraft'],
  ['Service user',       'A system user with no login shell; data folder mode 750'],
  ['Paper',              'Download only if the sha256 does not match, then verify it'],
  ['RCON tools',         'Build mcrcon from a pinned Git tag and add a small mccmd helper'],
  ['systemd service',    'A hardened minecraft.service that restarts on failure'],
  ['Auto-stop',          'An idle-check script plus a systemd timer'],
]

const AUTOSTOP = [
  'mc-idle.timer fires 5 minutes after boot, then every 5 minutes.',
  'The check asks Paper for the player list over localhost RCON. If anyone is online, it clears the idle stamp and exits.',
  'Otherwise it records when the server first went empty and works out how long it has been idle.',
  'At 30 minutes it runs systemctl poweroff. Because instance_initiated_shutdown_behavior = "stop", AWS stops the instance instead of terminating it. The disks are kept and compute billing ends.',
]

const SPECS = [
  { g: 'COMPUTE & STORAGE', rows: [
    ['Instance', 't4g.medium · 2 vCPU ARM64 Graviton2 · 4 GiB RAM · burstable'],
    ['OS', 'Ubuntu 24.04 LTS ARM64; the AMI is ignored after creation so new images don\'t force a rebuild'],
    ['Metadata', 'IMDSv2 required'],
    ['Root disk', '12 GiB gp3, encrypted'],
    ['World disk', '8 GiB gp3, encrypted, 3000 IOPS / 125 MB/s, ext4, mounted by UUID'],
    ['Java heap', '-Xms2G -Xmx2G (half of RAM)'],
  ]},
  { g: 'NETWORK', rows: [
    ['VPC', '10.20.0.0/16, DNS support and hostnames on'],
    ['Subnet', '10.20.1.0/24 public, ap-southeast-1a'],
    ['Routing', '0.0.0.0/0 → internet gateway'],
    ['Inbound', 'TCP 25565 from anywhere · TCP 22 from one /32 (validated in Terraform)'],
    ['RCON', 'TCP 25575 on 127.0.0.1 only'],
    ['Public IP', 'Auto-assigned; changes on every start (no Elastic IP)'],
  ]},
  { g: 'SOFTWARE', rows: [
    ['Terraform', '1.16 · AWS provider ~> 6.0, pinned by the lock file'],
    ['Default tags', 'Project=minecraft, ManagedBy=terraform on every resource'],
    ['Java', 'OpenJDK 17 (headless)'],
    ['Paper', '1.20.1, verified by sha256 on download'],
    ['mcrcon', 'v0.7.2, built from a pinned Git tag'],
    ['Server', 'online-mode, enforced whitelist, max-players=5'],
  ]},
]

const SECURITY = [
  ['AWS credentials', 'IAM Identity Center with 4-hour temporary sessions; no access keys on the laptop'],
  ['Root account', 'MFA on; not used day to day'],
  ['SSH', 'Port 22 open to one /32 only; key-only login; ed25519 key with a passphrase'],
  ['Player access', 'online-mode=true (real Mojang accounts only) plus an enforced whitelist'],
  ['RCON', 'Localhost only, never in the security group'],
  ['Instance metadata', 'IMDSv2 required'],
  ['Encryption', 'Root disk, world disk and snapshots encrypted with the AWS-managed EBS key'],
  ['Service hardening', 'Dedicated no-login user; NoNewPrivileges, ProtectSystem=strict, ProtectHome, PrivateTmp'],
  ['Least privilege', 'Backup role can be assumed only by dlm.amazonaws.com'],
  ['Secrets hygiene', 'State, plans and tfvars gitignored; full Git history scanned clean of secrets'],
  ['Supply chain', 'Paper checksum-verified, mcrcon built from a pinned tag, provider pinned by lock file'],
]

const RATES = [
  ['EC2 t4g.medium', '$0.042 / hour', 'Only while running, per second'],
  ['Public IPv4', '$0.005 / hour', 'Only while running'],
  ['EBS gp3 (12 + 8 GiB)', '≈ $1.92 / month', 'Always, even when stopped'],
  ['EBS snapshots (7, incremental)', '≈ $0.05 / month', 'Always'],
]

const ESTIMATES = [
  { h: 0,   run: 0.00, total: 1.97 },
  { h: 30,  run: 1.41, total: 3.38 },
  { h: 60,  run: 2.82, total: 4.79 },
  { h: 120, run: 5.64, total: 7.61 },
]

const PHASES = [
  { n: '01', date: '11 Oct',       t: 'Planning',              d: 'Requirements (2–5 players, low lag, part-time play), region, instance size, disks, budget and tagging plan.' },
  { n: '02', date: '12 Oct',       t: 'Dev environment',       d: 'WSL Ubuntu, ed25519 SSH key, AWS CLI and Terraform, IAM Identity Center SSO, root MFA, $5 budget.' },
  { n: '03', date: '12 – 20 Oct',  t: 'Terraform infrastructure', d: 'Built in three applies (network, security, compute) with a fmt → validate → plan → review → apply loop. Practised a full destroy and rebuild.' },
  { n: '04', date: '20 Oct',       t: 'Linux configuration',   d: 'Formatted and mounted the world disk by UUID, created the service user, installed Java and verified the Paper download.' },
  { n: '05', date: '21 Oct',       t: 'systemd + setup script', d: 'Ran Paper as a systemd service, then moved every manual step into an idempotent cloud-init script. A rebuild kept the world.' },
  { n: '06', date: '21 Oct',       t: 'Access, whitelist, RCON', d: 'Enforced the whitelist and online mode, set up localhost RCON and confirmed key-only SSH.' },
  { n: '07', date: '23 Oct',       t: 'Troubleshooting',       d: 'Broke the service and the firewall on purpose and learned to tell server faults from network faults. Terraform detected and repaired the drift.' },
  { n: '08', date: '23 – 25 Oct',  t: 'Backups & auto-stop',   d: 'DLM snapshot policy, a snapshot restore drill and the idle auto-stop timer.' },
  { n: '09', date: '23 Oct',       t: 'Git hygiene',           d: 'Removed an accidentally committed plan file from all history and scanned every commit for secrets.' },
  { n: '10', date: 'From 25 Oct',  t: 'Review & docs',         d: 'Full documentation, runbook and teardown checklist; code pushed to a private GitHub repo.' },
]

const DRILLS = [
  { id: 'A', t: 'Crash loop',             s: 'DONE',        d: 'Renamed paper.jar so the service failed on every start. The journal showed "Unable to access jarfile", and nc returned "connection refused", which points to the server layer rather than the network. Fixed, restarted, and verified with an RCON player list.' },
  { id: 'B', t: 'Deleted whitelist',      s: 'DONE',        d: 'Deleted whitelist.json, then restored it from the nightly DLM snapshot through a temporary read-only volume. diff was identical, level.dat passed gzip -t, and the temporary volume was deleted and confirmed gone.' },
  { id: 'C', t: 'Expired SSO session',    s: 'IN PROGRESS', d: 'Practise reading expired-token errors from the AWS CLI and Terraform, then recovering with a fresh SSO login.' },
  { id: 'D', t: 'SSH lockout',            s: 'PLANNED',     d: 'Simulate a wrong home IP in the SSH rule and fix it through Terraform, not the console.' },
]

const LESSONS = [
  ['Read the plan\'s per-resource headers, not just the summary', 'A plan showed the expected "3 add, 1 change", but a tag landed on the instance instead of the volume.'],
  ['Long-running programs belong in systemd', 'Friends were disconnected when an SSH session that had started the server dropped.'],
  ['"Refused" vs "timed out" tells you the layer', 'nc refused = the server software; timed out = the network or security group.'],
  ['Restart=on-failure can\'t fix a broken setup', 'The restart counter hit 28 during the crash-loop drill.'],
  ['A snapshot is one moment in time', 'Pick the newest snapshot taken before the mistake, and compare timestamps with stat.'],
  ['Test .gitignore before the first commit', '*.tfplan does not match a file named tfplan, and that is how a plan file got committed.'],
  ['Prove results instead of assuming them', 'diff, gzip -t and a NotFound response are evidence; "looks fine" is not.'],
]

/* ───────────────────────── UI pieces ───────────────────────── */

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView(0.08)
  return (
    <div ref={ref} className={className}
      style={{ transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)' }}>
      {children}
    </div>
  )
}

function SectionHead({ num, title, accent, sub }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="sys-label text-[#F6C90E]/80">{num} /////</div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#F6C90E]/25 to-transparent" />
      </div>
      <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.25rem)] text-[#EEEEEE] tracking-tight leading-none">
        {title} {accent && <span className="text-[#F6C90E]">{accent}</span>}
      </h2>
      {sub && <p className="mt-3 text-[#EEEEEE]/70 text-sm max-w-2xl">{sub}</p>}
    </div>
  )
}

function Section({ id, children }) {
  return (
    <section id={id} className="py-16 md:py-20 border-t border-[#F6C90E]/[0.07]">
      {children}
    </section>
  )
}

function Panel({ children, className = '' }) {
  return (
    <div className={`relative min-w-0 break-words border border-[#F6C90E]/10 bg-[#303841] p-6 ${className}`}>
      <div className="hud-corner tl" />
      <div className="hud-corner br" />
      {children}
    </div>
  )
}

function Status({ s }) {
  const style = s === 'DONE'
    ? 'border-[#F6C90E]/40 text-[#F6C90E] bg-[#F6C90E]/5'
    : s === 'IN PROGRESS'
      ? 'border-[#F6C90E]/25 text-[#F6C90E]/80'
      : 'border-[#EEEEEE]/15 text-[#EEEEEE]/70'
  return <span className={`font-mono text-[10px] tracking-wider px-2 py-0.5 border whitespace-nowrap ${style}`}>{s}</span>
}

function Lightbox({ open, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    // Move focus into the dialog, keep it there (Close is the only control), and hand it back on exit.
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-label="Architecture diagram, enlarged"
      className="fixed inset-0 z-[200] bg-black/90 overflow-auto p-4 md:p-10" onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose}
        className="fixed top-4 right-4 z-10 font-mono text-xs tracking-widest px-3 py-1.5 border border-[#F6C90E]/40 text-[#F6C90E] bg-[#1E242A] hover:bg-[#F6C90E]/10">
        CLOSE [ESC]
      </button>
      <img src={DIAGRAM} alt="AWS architecture diagram of the Minecraft EC2 server"
        className="mx-auto max-w-none w-[1600px] bg-white" onClick={e => e.stopPropagation()} />
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function MinecraftEc2() {
  const [zoom, setZoom] = useState(false)
  const closeZoom = useCallback(() => setZoom(false), [])
  const [heroIn, setHeroIn] = useState(false)

  usePageMeta({
    title: 'Minecraft on AWS EC2 — Reginald Unisa',
    description: 'Case study: a private Minecraft server on one ARM EC2 instance, built entirely with Terraform. It runs only while people play, powers itself off when idle and snapshots its world every night.',
  })

  useEffect(() => {
    const t = requestAnimationFrame(() => setHeroIn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const maxTotal = Math.max(...ESTIMATES.map(e => e.total))

  return (
    <main id="main" tabIndex={-1} className="relative">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 pt-16 pb-16 md:pt-24">
          <Link to="/#projects" className="inline-flex items-center gap-2 font-display text-xs tracking-widest text-[#EEEEEE]/70 hover:text-[#F6C90E] transition-colors mb-12">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6H2M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            BACK TO PROJECTS
          </Link>

          <div style={{ transition: 'all .8s ease', opacity: heroIn ? 1 : 0, transform: heroIn ? 'translateY(0)' : 'translateY(24px)' }}>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="sys-label">PRJ::002 // CASE STUDY</span>
              <span className="font-mono text-[10px] px-2 py-0.5 border border-[#F6C90E]/30 text-[#F6C90E]">CLOUD / DEVOPS</span>
            </div>
            <h1 className="font-display font-black text-[clamp(2.75rem,8vw,6.5rem)] text-[#EEEEEE] tracking-tight leading-[0.9] mb-6">
              MINECRAFT ON <span className="text-[#F6C90E]">AWS EC2</span>
            </h1>
            <p className="text-[#EEEEEE]/70 text-lg leading-relaxed max-w-3xl mb-8">
              A private Minecraft Java 1.20.1 server for up to five friends, built entirely with Terraform on one
              EC2 instance in Singapore. It runs only while people play and backs up its world every night.
            </p>
            <div className="flex flex-wrap gap-2 mb-12">
              {STACK.map(t => (
                <span key={t} className="font-mono text-[10px] px-2 py-1 bg-[#3A4750] text-[#EEEEEE]/70 border border-[#EEEEEE]/10">{t}</span>
              ))}
            </div>

            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#F6C90E]/10 border border-[#F6C90E]/10">
              {META.map(m => (
                <div key={m.k} className="bg-[#1E242A] p-4">
                  <dt className="font-mono text-[10px] tracking-widest text-[#F6C90E]/80 mb-1">{m.k}</dt>
                  <dd className="font-display text-base text-[#EEEEEE]/85 tracking-wide">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        {/* ── Stats ── */}
        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pb-12">
          {STATS.map(s => (
            <Panel key={s.l} className="!p-4">
              <div className="font-display font-black text-3xl text-[#F6C90E] leading-none mb-2">{s.n}</div>
              <div className="font-mono text-[10px] tracking-wide text-[#EEEEEE]/70 uppercase leading-snug">{s.l}</div>
            </Panel>
          ))}
        </Reveal>

        {/* ── Jump list ── */}
        <nav aria-label="On this page" className="flex flex-wrap gap-x-5 gap-y-2 pb-12">
          {TOC.map(([id, label], i) => (
            <a key={id} href={`#${id}`} className="font-mono text-[11px] tracking-wider text-[#EEEEEE]/70 hover:text-[#F6C90E] transition-colors">
              <span className="text-[#F6C90E]/80">{String(i + 1).padStart(2, '0')}</span> {label.toUpperCase()}
            </a>
          ))}
        </nav>

        {/* ── 01 Overview ── */}
        <Section id="overview">
          <Reveal>
            <SectionHead num="01" title="THE" accent="BRIEF" />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 space-y-4 text-[#EEEEEE]/70 leading-relaxed">
                <p>
                  Friends wanted a low-lag Minecraft server for 2 to 5 people who play part-time. Paying for a server
                  that sits idle around the clock made no sense, and neither did losing the world if something broke.
                </p>
                <p>
                  The solution is one small ARM instance in Singapore running a whitelisted Paper server. The world lives
                  on its own encrypted disk, so the instance can be rebuilt at any time without losing progress. The server
                  powers itself off 30 minutes after the last player leaves, and Data Lifecycle Manager snapshots the world
                  disk every day.
                </p>
                <p className="text-[#EEEEEE]/70 text-sm">
                  Built in ten phases between 11 and 25 October 2026, followed by incident drills from 28 October.
                </p>
              </div>
              <div className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
                {HIGHLIGHTS.map((h, i) => (
                  <Panel key={h.t}>
                    <div className="font-mono text-[10px] text-[#F6C90E]/80 mb-2">0{i + 1}</div>
                    <h3 className="font-display font-bold text-lg text-[#EEEEEE] tracking-wide mb-2">{h.t}</h3>
                    <p className="text-[#EEEEEE]/70 text-sm leading-relaxed">{h.d}</p>
                  </Panel>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ── 02 Architecture ── */}
        <Section id="architecture">
          <Reveal>
            <SectionHead num="02" title=" AWS INFRASTRUCTURE" accent="DIAGRAM"
              sub="Everything inside the AWS account box is created by Terraform except IAM Identity Center and AWS Budgets, which were set up by hand." />
            <figure className="mb-10">
              <button type="button" onClick={() => setZoom(true)}
                className="group relative block w-full border border-[#F6C90E]/15 hover:border-[#F6C90E]/45 transition-colors bg-white p-2 md:p-4">
                <img src={DIAGRAM} alt="AWS architecture diagram: players and admin laptop reach an EC2 instance through an internet gateway inside a VPC in ap-southeast-1; Data Lifecycle Manager snapshots the tagged world volume daily."
                  width="2240" height="1400" loading="lazy" decoding="async" className="w-full h-auto" />
                <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widest px-2 py-1 bg-[#1E242A] text-[#F6C90E] border border-[#F6C90E]/40 opacity-80 group-hover:opacity-100">
                  CLICK TO ENLARGE
                </span>
              </button>
              <figcaption className="mt-3 font-mono text-[10px] tracking-wide text-[#EEEEEE]/70">
                FIG.01 · Drawn with the official AWS Architecture Icons. EBS volumes live in the Availability Zone, not the subnet.
              </figcaption>
            </figure>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h3 className="font-display font-bold text-xl text-[#EEEEEE] tracking-wide mb-4">How traffic flows</h3>
                <div className="border-t border-[#F6C90E]/10">
                  {FLOWS.map(f => (
                    <div key={f.f} className="grid sm:grid-cols-[130px_1fr] gap-1 sm:gap-4 py-3 border-b border-[#F6C90E]/10">
                      <div className="font-mono text-[11px] tracking-wider text-[#F6C90E]/80 uppercase pt-0.5">{f.f}</div>
                      <div className="text-sm text-[#EEEEEE]/70 leading-relaxed">{f.p}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="font-display font-bold text-xl text-[#EEEEEE] tracking-wide mb-4">Deliberately left out</h3>
                <ul className="space-y-3">
                  {NOT_IN_DESIGN.map(([t, d]) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed">
                      <span className="text-[#F6C90E] mt-0.5 font-mono text-xs">✕</span>
                      <span className="text-[#EEEEEE]/70"><strong className="text-[#EEEEEE]/85 font-medium">{t}:</strong> {d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ── 03 Decisions ── */}
        <Section id="decisions">
          <Reveal>
            <SectionHead num="03" title="KEY" accent="DECISIONS" />
            <div className="border border-[#F6C90E]/10">
              <div className="hidden md:grid grid-cols-[160px_1fr_1fr] gap-4 px-5 py-3 bg-[#1E242A] font-mono text-[10px] tracking-widest text-[#F6C90E]/80">
                <div>DECISION</div><div>CHOICE</div><div>WHY</div>
              </div>
              {DECISIONS.map((r, i) => (
                <div key={r.d} className={`grid md:grid-cols-[160px_1fr_1fr] gap-1 md:gap-4 px-5 py-3 text-sm ${i % 2 ? 'bg-[#303841]/40' : 'bg-[#303841]/80'}`}>
                  <div className="font-display font-semibold tracking-wide text-[#EEEEEE]/85">{r.d}</div>
                  <div className="text-[#EEEEEE]/70">{r.c}</div>
                  <div className="text-[#EEEEEE]/70">{r.w}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 04 Internals ── */}
        <Section id="internals">
          <Reveal>
            <SectionHead num="04" title="SERVER" accent="INTERNALS (EC2)"
              sub="What runs inside the instance, and how the auto-stop loop decides to power it off." />
            <div className="grid lg:grid-cols-2 gap-4">
              <Panel>
                <div className="sys-label !text-[10px] mb-1">CLOUD-INIT · FIRST BOOT</div>
                <h3 className="font-display font-bold text-xl text-[#EEEEEE] tracking-wide mb-2">Idempotent setup script</h3>
                <p className="text-sm text-[#EEEEEE]/70 leading-relaxed mb-5">
                  Terraform renders a template and passes it as user_data. Every step is safe to re-run, which is why
                  replacing the instance keeps the existing world.
                </p>
                <ol className="space-y-2.5">
                  {BOOT_STEPS.map(([t, d], i) => (
                    <li key={t} className="grid grid-cols-[28px_1fr] gap-2 text-sm">
                      <span className="font-mono text-[11px] text-[#F6C90E]/80 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span><span className="text-[#EEEEEE]/85 font-medium">{t}</span> <span className="text-[#EEEEEE]/70">· {d}</span></span>
                    </li>
                  ))}
                </ol>
              </Panel>

              <Panel>
                <div className="sys-label !text-[10px] mb-1">MC-IDLE.TIMER · EVERY 5 MIN</div>
                <h3 className="font-display font-bold text-xl text-[#EEEEEE] tracking-wide mb-2">The auto-stop loop</h3>
                <p className="text-sm text-[#EEEEEE]/70 leading-relaxed mb-5">
                  A systemd timer, a short shell script and localhost RCON keep the bill tied to actual play time.
                </p>
                <ol className="relative border-l border-[#F6C90E]/20 ml-1.5 space-y-5">
                  {AUTOSTOP.map((s, i) => (
                    <li key={i} className="pl-5 relative text-sm text-[#EEEEEE]/70 leading-relaxed">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 bg-[#F6C90E]" style={{ clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="mt-6 border-l-2 border-[#F6C90E]/60 bg-[#F6C90E]/5 px-4 py-3 text-xs text-[#EEEEEE]/70 leading-relaxed">
                  <span className="text-[#F6C90E] font-mono tracking-wider">WATCH OUT · </span>
                  If RCON breaks, the check sees zero players and powers off about 35 minutes after boot even with people
                  online. So the RCON settings must always be restored along with the world.
                </div>
              </Panel>
            </div>
          </Reveal>
        </Section>

        {/* ── 05 Specs ── */}
        <Section id="specs">
          <Reveal>
            <SectionHead num="05" title="TECHNICAL" accent="SPECS" />
            <div className="grid lg:grid-cols-3 gap-4">
              {SPECS.map(g => (
                <Panel key={g.g}>
                  <div className="sys-label !text-[10px] mb-4">{g.g}</div>
                  <dl className="space-y-3">
                    {g.rows.map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-display font-semibold text-sm tracking-wide text-[#EEEEEE]/85">{k}</dt>
                        <dd className="text-sm text-[#EEEEEE]/70 leading-relaxed">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 06 Security ── */}
        <Section id="security">
          <Reveal>
            <SectionHead num="06" title="SECURITY" accent="CONTROLS"
              sub="No credential, key or password is stored in the Terraform code, the setup script or the Git history." />
            <div className="grid md:grid-cols-2 gap-x-8">
              {SECURITY.map(([k, v]) => (
                <div key={k} className="flex gap-4 py-3 border-b border-[#F6C90E]/10">
                  <svg className="flex-shrink-0 mt-1 text-[#F6C90E]" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 1l4 1.5v3c0 2.5-1.7 4.3-4 5-2.3-.7-4-2.5-4-5v-3L6 1z"/><path d="M4.2 6l1.3 1.3L8 4.8" strokeLinecap="round"/></svg>
                  <div className="text-sm leading-relaxed">
                    <span className="text-[#EEEEEE]/85 font-medium">{k}</span>
                    <span className="text-[#EEEEEE]/70"> · {v}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 07 Cost ── */}
        <Section id="cost">
          <Reveal>
            <SectionHead num="07" title="COST" accent="MODEL"
              sub="About $2 a month while stopped, plus about $0.05 for every hour it runs. Rates are approximate Singapore On-Demand prices." />
            <div className="grid lg:grid-cols-2 gap-4">
              <Panel>
                <div className="sys-label !text-[10px] mb-4">WHAT BILLS, AND WHEN</div>
                <div className="space-y-3">
                  {RATES.map(([r, rate, when]) => (
                    <div key={r} className="grid grid-cols-[1fr_auto] gap-x-4 pb-3 border-b border-[#F6C90E]/10 last:border-0 last:pb-0">
                      <div className="text-sm text-[#EEEEEE]/80">{r}</div>
                      <div className="font-mono text-sm text-[#F6C90E] text-right">{rate}</div>
                      <div className="text-xs text-[#EEEEEE]/70 col-span-2">{when}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs text-[#EEEEEE]/70 leading-relaxed">
                  Free: VPC, subnet, internet gateway, route table, security group, key pair, IAM role, DLM itself,
                  IAM Identity Center and the systemd timer.
                </p>
              </Panel>

              <Panel>
                <div className="sys-label !text-[10px] mb-4">MONTHLY ESTIMATE BY PLAY TIME</div>
                <div className="space-y-4">
                  {ESTIMATES.map(e => (
                    <div key={e.h}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#EEEEEE]/70">{e.h} h / month {e.h ? <span className="text-[#EEEEEE]/70">({e.h / 30} h a day)</span> : <span className="text-[#EEEEEE]/70">(idle)</span>}</span>
                        <span className="font-mono text-[#F6C90E]">${e.total.toFixed(2)}</span>
                      </div>
                      <div className="flex h-2 bg-[#F6C90E]/[0.06]" role="img"
                        aria-label={`Always-on $1.97 plus running $${e.run.toFixed(2)}`}>
                        <div className="h-full bg-[#EEEEEE]/30" style={{ width: `${(1.97 / maxTotal) * 100}%` }} />
                        <div className="h-full bg-[#F6C90E]" style={{ width: `${(e.run / maxTotal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-5 mt-5 font-mono text-[10px] tracking-wide text-[#EEEEEE]/70">
                  <span className="flex items-center gap-2"><span className="w-3 h-2 bg-[#EEEEEE]/30" /> ALWAYS-ON (DISKS)</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-2 bg-[#F6C90E]" /> RUNNING TIME</span>
                </div>
                <p className="mt-5 text-xs text-[#EEEEEE]/70 leading-relaxed">
                  The $5 budget alert trips at about 65 hours of play a month. Savings Plans only pay off for servers that
                  run most of the month, so On-Demand is the right fit here.
                </p>
              </Panel>
            </div>
          </Reveal>
        </Section>

        {/* ── 08 Timeline ── */}
        <Section id="timeline">
          <Reveal>
            <SectionHead num="08" title="BUILD" accent="TIMELINE" sub="Ten phases, from planning to documentation, in October 2026." />
            <ol className="relative border-l border-[#F6C90E]/15 ml-2">
              {PHASES.map(p => (
                <li key={p.n} className="relative pl-8 pb-8 last:pb-0">
                  <span className="absolute -left-[6px] top-1 w-3 h-3 border border-[#F6C90E] bg-[#000607]" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <span className="font-mono text-[11px] text-[#F6C90E]/80">PHASE {p.n}</span>
                    <h3 className="font-display font-bold text-lg text-[#EEEEEE] tracking-wide">{p.t}</h3>
                    <span className="font-mono text-[10px] text-[#EEEEEE]/70">{p.date}</span>
                  </div>
                  <p className="text-sm text-[#EEEEEE]/70 leading-relaxed max-w-3xl">{p.d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Section>

        {/* ── 09 Drills ── */}
        <Section id="drills">
          <Reveal>
            <SectionHead num="09" title="INCIDENT" accent="DRILLS"
              sub="Each drill breaks one thing on purpose while nobody is playing, so the first real failure doesn't happen on a game night. Every drill follows the same steps: break it, read the symptoms, find the cause, fix it, prove the fix, clean up." />
            <div className="grid md:grid-cols-2 gap-4">
              {DRILLS.map(d => (
                <Panel key={d.id}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display font-black text-3xl text-[#F6C90E]/80 leading-none">{d.id}</span>
                      <h3 className="font-display font-bold text-lg text-[#EEEEEE] tracking-wide">{d.t}</h3>
                    </div>
                    <Status s={d.s} />
                  </div>
                  <p className="text-sm text-[#EEEEEE]/70 leading-relaxed">{d.d}</p>
                </Panel>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── 10 Lessons ── */}
        <Section id="lessons">
          <Reveal>
            <SectionHead num="10" title="LESSONS" accent="LEARNED"
              sub="The recurring lesson: check why something happened, not only that the result looked right." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {LESSONS.map(([t, d], i) => (
                <div key={t} className="border border-[#F6C90E]/10 bg-[#303841]/50 p-5 hover:border-[#F6C90E]/30 transition-colors">
                  <div className="font-mono text-[10px] text-[#F6C90E]/80 mb-2">LOG::{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="font-display font-semibold text-base text-[#EEEEEE]/90 tracking-wide mb-2 leading-snug">{t}</h3>
                  <p className="text-xs text-[#EEEEEE]/70 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── Outro ── */}
        <div className="py-16 border-t border-[#F6C90E]/[0.07] text-center">
          <Link to="/#projects"
            className="relative inline-flex items-center gap-3 px-10 py-3 border border-[#F6C90E]/30 text-[#EEEEEE]/70 font-display tracking-widest text-sm hover:border-[#F6C90E]/60 hover:text-[#F6C90E] transition-all">
            <div className="hud-corner tl" style={{ width: 6, height: 6 }} />
            <div className="hud-corner br" style={{ width: 6, height: 6 }} />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6H2M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            BACK TO ALL PROJECTS
          </Link>
        </div>
      </div>

      <Lightbox open={zoom} onClose={closeZoom} />
    </main>
  )
}
