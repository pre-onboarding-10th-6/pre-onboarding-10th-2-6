import { useEffect, useRef } from 'react'

type Handler = (event: MouseEvent) => void

const useClickOutside = <T extends HTMLElement>(handler: Handler) => {
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return
      }
      handler(e)
    }
    document.addEventListener('mousedown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref, handler])

  return { ref }
}

export default useClickOutside
