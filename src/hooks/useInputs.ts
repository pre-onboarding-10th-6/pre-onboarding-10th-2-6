import { useState } from 'react'

const useInputs = (initialValue: string) => {
  const [values, setValues] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e.target.value)
  }

  return { values, setValues, handleChange }
}

export default useInputs
