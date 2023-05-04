import { useState } from 'react'

import { Suggestion } from '../types/search'

const useKeyboardNavigation = (
  suggestions: Suggestion[],
  setKeyword: React.Dispatch<React.SetStateAction<string>>
) => {
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  const handleMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) {
      return
    }

    const lastIndex = suggestions.length - 1

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex < lastIndex ? prevIndex + 1 : 0))
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : lastIndex))
        break
      }
      case 'Escape': {
        setFocusIndex(-1)
        break
      }
      case 'Enter': {
        focusIndex > -1 && setKeyword(suggestions[focusIndex].name)
        break
      }
      default: {
        break
      }
    }
  }

  return { focusIndex, setFocusIndex, handleMoveFocus }
}

export default useKeyboardNavigation
