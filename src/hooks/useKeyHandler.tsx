import { useState } from 'react'

const useKeyHandler = (result: any): any => {
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const handleKeyUpDown: any = (event: React.KeyboardEvent) => {
    const { key } = event

    switch (key) {
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIdx((prev: any) => Math.max(prev - 1, -1))
        break
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIdx((prev: any) => Math.min(prev + 1, result.length - 1))
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
