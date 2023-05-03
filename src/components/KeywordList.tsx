import React from 'react'

import { KeywordListProps } from '../types/type'

const KeywordList: React.FC<KeywordListProps> = ({ results }) => {
  if (!results.length) {
    return <p>검색어가 없습니다.</p>
  }
  return (
    <div>
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default React.memo(KeywordList)
