import { useState, useCallback } from 'react'

const useKeyboardNavigation = (
  length: number,
  onClick: (index: number) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault()
          if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
          }
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (selectedIndex < length - 1) {
            setSelectedIndex(selectedIndex + 1)
          }
          break
        }
        case 'Tab':
          e.preventDefault()
          if (selectedIndex < length - 1) {
            setSelectedIndex(selectedIndex + 1)
          }
          break
        case 'Enter': {
          onClick(selectedIndex)
          break
        }
        default:
          break
      }
    },
    [selectedIndex, setSelectedIndex, length, onClick]
  )

  return { selectedIndex, handleKeyDown }
}

export default useKeyboardNavigation
