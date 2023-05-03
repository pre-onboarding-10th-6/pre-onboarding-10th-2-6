import styled from 'styled-components'

export const Wrap = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #cae9ff;
`

export const Banner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  padding: 120px 0 290px;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;
  margin: 0;
  margin-bottom: 20px;
  font-family: inherit;
  text-align: center;
`

export const InputWrap = styled.div`
border-radius: 42px;
border: 2px solid;
border-color: #FFFFFF;
background-color: #FFFFFF;
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
}
`

export const Input = styled.input`
  width: 100%;
  border-radius: 42px;
  border: 0;
  border-color: #c2c8ce;
  background-color: #ffffff;
  adding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  font-size: 1.125rem;
  letter-spacing: -0.018em;
  line-height: 1.6;
  display: flex;
  padding: 20px 10px 20px 24px;
  font-weight: 400;
`

export const Button = styled.button`
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  display: flex;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  background-color: #007be9;
  display: flex;
  color: #ffffff;
  justify-content: center;
  align-items: center;
`
export const SearchBox = styled.div`
  position: absolute;
  width: 100%;
  padding: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  border-radius: 0.375rem;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  top: 4.5rem;
`
export const Item = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:hover {
    --tw-bg-opacity: 1;
    background-color: #f3f4f6;
    cursor: pointer;
  }
`
