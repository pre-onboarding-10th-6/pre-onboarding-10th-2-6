import { useEffect, useRef, useState } from 'react'

const useClickOutside = () => {
  const ref = useRef<HTMLFormElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const onFocusHandler = () => {
    setIsFocus(true)
  }

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return
      }
      setIsFocus(false)
    }
    document.addEventListener('mousedown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref])

  return { ref, isFocus, onFocusHandler }
}

export default useClickOutside
