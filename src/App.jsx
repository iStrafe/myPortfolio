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

export default function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      {/* Push content right of the 64px sidebar */}
      <div className="pl-16">
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
        <Footer />
      </div>
    </>
  )
}
