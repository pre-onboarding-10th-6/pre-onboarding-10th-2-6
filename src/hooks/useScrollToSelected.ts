import { useEffect, useRef } from 'react'

const useScrollToSelected = (selectedIdx: number) => {
  const scrollListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (scrollListRef.current && selectedIdx !== -1) {
      const selectedEl = scrollListRef.current.children[
        selectedIdx
      ] as HTMLLIElement
      const listContainerRect = scrollListRef.current.getBoundingClientRect()
      const selectedItemRect = selectedEl.getBoundingClientRect()

      if (selectedItemRect.bottom > listContainerRect.bottom) {
        scrollListRef.current.scrollTop +=
          selectedItemRect.bottom - listContainerRect.bottom
      } else if (selectedItemRect.top < listContainerRect.top) {
        scrollListRef.current.scrollTop -=
          listContainerRect.top - selectedItemRect.top
      }
    } else if (scrollListRef.current) {
      scrollListRef.current.scrollTop = 0
    }
  }, [selectedIdx])
  return scrollListRef
}

export default useScrollToSelected
