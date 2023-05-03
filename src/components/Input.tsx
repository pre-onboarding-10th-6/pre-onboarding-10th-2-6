import { ChangeEvent, ReactNode, useState } from 'react'
import styled from 'styled-components'

type InputProp = {
  id: string
  type: string
  name: string
  value: string
  labelText?: string
  color: string
  placeholder: string
  children?: ReactNode
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: any
}

export const Input = (props: InputProp) => {
  const {
    id,
    type,
    name,
    value,
    labelText,
    placeholder,
    onChange,
    color,
    children,
    onKeyDown
  } = props
  const [isFocus, setIsFocus] = useState(false)
  return (
    <InputWrap>
      <label>{labelText ? labelText : ''}</label>
      <StyledInput
        id={id}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        color={color}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onKeyDown={onKeyDown}
      />
      <SearchContainer isFocus={isFocus}>{children}</SearchContainer>
    </InputWrap>
  )
}

const InputWrap = styled.div`
  position: relative;
  background: green;
`

const SearchContainer = styled.div<{ isFocus: boolean }>`
  display: ${({ isFocus }) => (isFocus ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 200px;
  overflow-y: scroll;
  background-color: orange;
  padding: 8px;
  border: 1px solid #333;
`

const StyledInput = styled.input`
  font-size: 20px;
  padding: 8px;
  border: 1px solid #333;
  color: ${props => props.color};
`
