import { Component } from 'react'

// Error boundaries must be class components. The likeliest failure here is a lazy page chunk
// that no longer exists because a new deploy replaced it, and a reload fixes that.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main id="main" tabIndex={-1} className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="sys-label">SYSTEM FAULT</p>
        <h1 className="font-display font-black text-4xl text-[#EEEEEE] tracking-tight">THIS PAGE FAILED TO LOAD</h1>
        <button type="button" onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#F6C90E] text-[#252C33] font-display font-bold tracking-[0.12em] text-sm hover:bg-[#FFD740] transition-colors">
          RELOAD
        </button>
      </main>
    )
  }
}
