import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import TechCarousel from './components/TechCarousel'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Divider from './components/Divider'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './pages/NotFound'

// Most visitors never open a case study, so its 38 kB of source loads only on demand.
const MinecraftEc2 = lazy(() => import('./pages/MinecraftEc2'))

function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <Divider />
      <About />
      <Divider />
      <TechCarousel />
      <Divider />
      <Projects />
      <Divider />
      <Skills />
      <Divider />
      <Contact />
    </main>
  )
}

// On every route change: scroll to the #hash target if there is one, else to the top.
// Retries for up to 5s because the target may be inside a lazy page that is still downloading.
// `key` is a dependency so that clicking the link you are already on scrolls there again.
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    // 'instant' overrides the CSS smooth scrolling: a new page should simply start at the top.
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    let tries = 0
    let timer
    let cancelled = false
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        // Web fonts arriving late reflow the text and move the target, so re-align once they land.
        document.fonts.ready.then(() => { if (!cancelled) el.scrollIntoView() })
      } else if (tries++ < 100) {
        timer = setTimeout(go, 50)
      }
    }
    go()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [pathname, hash, key])
  return null
}

function PageLoader() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen flex items-center justify-center">
      <p role="status" className="sys-label">LOADING</p>
    </main>
  )
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Cursor />
      <Navbar />
      <ScrollManager />
      {/* Push content right of the 64px sidebar */}
      <div className="pl-16">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/minecraft-ec2" element={<MinecraftEc2 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </>
  )
}
