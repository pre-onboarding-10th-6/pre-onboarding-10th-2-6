import { useState, useRef } from 'react'

interface Props {
  onEnter?: () => void
}

const useKeyboard = ({ onEnter }: Props) => {
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
        if (focusIndex === -1) break
        e.preventDefault()
        onEnter && onEnter()
        setFocusIndex(-1)
        break
      }
    }
  }

  return { focusIndex, searchItemCnt, onKeyDownHandler }
}

export default useKeyboard
