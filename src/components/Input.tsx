import { ChangeEvent, ReactNode, useState } from 'react'
import styled from 'styled-components'

type InputProp = {
  id: string
  type: string
  name: string
  value: string
  labelText?: string
  color?: string
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
  width: 420px;
  margin-left: -15px;
`

const SearchContainer = styled.div<{ isFocus: boolean }>`
  display: ${({ isFocus }) => (isFocus ? 'block' : 'none')};
  position: absolute;
  top: 110%;
  left: 0;
  width: 440px;
  height: 320px;
  padding: 20px 0;
  background-color: #fff;
  border: none;
  border-radius: 24px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.05);
`

const StyledInput = styled.input`
  width: 100%;
  padding: 20px 0px 20px 24px;
  color: #333;
  font-size: 1.125rem;
  border: none;
  border-radius: 42px;
  ::placeholder {
    color: #d1d1d1;
  }
`
