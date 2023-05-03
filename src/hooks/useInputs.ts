import { useState } from 'react'

const useInputs = (initialValue: Record<string, string>) => {
  const [values, setValues] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
  }

  return { values, handleChange, setValues }
}

export default useInputs
