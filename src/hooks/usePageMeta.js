import { useEffect } from 'react'

// Sets the document title and meta description for a route, restoring the previous values on leave.
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const previousTitle = document.title
    const previousDescription = meta?.content

    document.title = title
    if (meta && description) meta.content = description

    return () => {
      document.title = previousTitle
      if (meta && description) meta.content = previousDescription
    }
  }, [title, description])
}
