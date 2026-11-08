import { useEffect } from 'react'
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
import MinecraftEc2 from './pages/MinecraftEc2'

function Home() {
  return (
    <main>
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
// Retries briefly because the target section may not be mounted yet after a page switch.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    let tries = 0
    let timer
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView()
      else if (tries++ < 20) timer = setTimeout(go, 50)
    }
    go()
    return () => clearTimeout(timer)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <ScrollManager />
      {/* Push content right of the 64px sidebar */}
      <div className="pl-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/minecraft-ec2" element={<MinecraftEc2 />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}
