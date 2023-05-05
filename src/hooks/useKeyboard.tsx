import { useState, useRef } from 'react'

const useKeyboard = (enterFunc: () => void) => {
  const searchItemCnt = useRef<HTMLUListElement | null>(null)
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchItemCnt.current === null) {
      throw Error('Ref 확인')
    }

    const maxIdx = searchItemCnt.current.childElementCount - 1

    switch (e.key) {
      case 'ArrowDown': {
        setFocusIndex(prev => (prev === maxIdx - 1 ? -1 : prev + 1))
        break
      }
      case 'ArrowUp': {
        setFocusIndex(prev => (prev === -1 ? maxIdx - 1 : prev - 1))
        break
      }
      case 'Enter': {
        e.preventDefault()
        enterFunc()
        setFocusIndex(-1)
        break
      }
      default: {
        break
      }
    }
  }

  return { focusIndex, searchItemCnt, onKeyDownHandler }
}

export default useKeyboard
