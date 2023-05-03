import styled from 'styled-components'

interface ListItemProps {
  selected: boolean
}

export const ListWrapper = styled.div`
  width: 100%;
  border-radius: 15px;
  border: 2px solid;
  margin-top: 15px;
  border-color: #ffffff;
  background-color: #ffffff;
  z-index: 1;
  position: relative;
  overflow: hidden;
`

export const List = styled.ul`
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 20rem;
  overflow-y: auto;
  background-color: #ffffff;
`

export const ListItem = styled.li<ListItemProps>`
  cursor: pointer;
  background-color: ${props => (props.selected ? 'lightgray' : 'white')};
  padding: 0.5rem;
  font-size: 1.1rem;
  &:hover {
    outline: none;
    background-color: #f2f2f2;
  }
`
