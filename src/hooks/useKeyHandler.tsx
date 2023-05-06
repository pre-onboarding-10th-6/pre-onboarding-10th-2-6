import { useEffect, useState } from 'react'

import { SEARCH_ITEM } from '../types'

const useKeyHandler = (
  result: SEARCH_ITEM[],
  debouncedValue: string,
  setValues: React.Dispatch<React.SetStateAction<string>>
) => {
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const handleKeyUpDown = (e: React.KeyboardEvent) => {
    if (!result.length) return

    const lastIndex = result.length - 1

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIdx(prevIndex => (prevIndex > 0 ? prevIndex - 1 : lastIndex))
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIdx(prevIndex => (prevIndex < lastIndex ? prevIndex + 1 : 0))
        break
      case 'Enter':
        selectedIdx > -1 && setValues(result[selectedIdx].name)
        break
      default:
        break
    }
  }

  useEffect(() => {
    setSelectedIdx(-1)
  }, [debouncedValue])

  return { handleKeyUpDown, selectedIdx, setSelectedIdx }
}

export default useKeyHandler
