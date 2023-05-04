import { useState } from 'react'

const useKeyHandler = (result: any): any => {
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

  return { handleKeyUpDown, selectedIdx }
}

export default useKeyHandler
