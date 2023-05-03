import styled from "styled-components";


const Main = styled.div`
  display: flex;
  width:400px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
`
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
`

const SearchInput = styled.input`
  width: 80%; 
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 20px 0 0 20px;
  margin: 10px 0;
  padding: 0px 20px;
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  &:focus {
    border: 1px solid #aaa;
  }
`

const Button = styled.button`
  width: 20%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 0 20px 20px 0;
  margin: 10px 0;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  &:focus {
    border: 1px solid #aaa;
  }
`

const Container = styled.div`
display: flex; 
flex-direction: column;
align-items: center;
width: 100%;
padding: 10px;
`;

const ResultContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 400px;
overflow-y: hidden;
border-radius: 0 0 10px 10px;
`;

const ResultRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 10px;
`;


export default {
  Main,
  Container,
  SearchBar,
  SearchInput,
  Button,
  ResultContainer,
  ResultRow
}