import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  border-radius: 42px;
  border: 2px solid #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  font-weight: 400;
  padding: 0 8px;
  height: 73px;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
  &:focus-within {
    border: 2px solid #007be9;
  }
`

const Input = styled.input`
  flex: 1;
  font-size: 1.6rem;
`

const Button = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #007be9;
  color: #fff;
  font-size: 1.2rem;
`

const SearchInput = () => {
  return (
    <Wrapper>
      <Input placeholder="질환명을 입력해 주세요." />
      <Button>검색</Button>
    </Wrapper>
  )
}

export default SearchInput
