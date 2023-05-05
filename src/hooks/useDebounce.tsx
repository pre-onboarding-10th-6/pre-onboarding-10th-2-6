import { useState, useEffect } from 'react'

const useDebouncer = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState((value = ''))

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebouncer

// const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   setSearchState({ ...searchState, input: e.target.value })
// }
