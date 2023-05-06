import { useEffect, useState } from 'react'

import { SEARCH_ITEM } from '../types'

const useKeyHandler = (result: SEARCH_ITEM[], debouncedValue: string) => {
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const handleKeyUpDown: any = (event: React.KeyboardEvent) => {
    const { key } = event

    switch (key) {
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIdx((prev: any) => {
          if (prev === -1) {
            return result.length - 1
          }
          return Math.max(prev - 1, 0)
        })
        break
      case 'ArrowDown':
        event.preventDefault()
        if (selectedIdx === 5) {
          setSelectedIdx(0)
        } else {
          setSelectedIdx((prev: any) => Math.min(prev + 1, result.length))
        }
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIdx >= 0) {
          console.log(`${result[selectedIdx].name}`)
        }
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
