import { useEffect, useState } from 'react'

const useDebounce = (value: string, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState<string>('')

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(value)
    }, delay)
    return () => {
      clearTimeout(id)
    }
  }, [value])
  return debounceValue
}

export default useDebounce
