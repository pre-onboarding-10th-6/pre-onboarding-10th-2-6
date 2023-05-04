import { useState } from 'react'

import { Disease } from '../types/disease'

const useKeyboardNavigation = (
  diseases: Disease[],
  setKeyword: React.Dispatch<React.SetStateAction<string>>
) => {
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  const handleMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!diseases.length) {
      return
    }

    const lastIndex = diseases.length - 1

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
        focusIndex > -1 && setKeyword(diseases[focusIndex].name)
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
