import styled from 'styled-components'

export const SearchBarWrapper = styled.div`
  border-radius: 42px;
  border: 2px solid;
  border-color: #ffffff;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.6;
  display: flex;
  width: 100%;
  position: relative;
  padding-right: 8px;
  justify-content: space-between;
`

export const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`
export const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 20px 10px 20px 24px;
  border: none;
  border-radius: 2rem;
  font-size: 1.1rem;
  &:focus {
    outline: none;
  }
`

export const Button = styled.button`
  box-sizing: content-box;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  overflow: visible;
  text-transform: none;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  border: 0;
  cursor: pointer;
  background-color: #007be9;
  color: #ffffff;
  align-items: center;
  text-align: center;
`
