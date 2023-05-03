import { useState } from "react";

const useIterator = <T>(items: T[]) => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    let prevIndex
    if (index === 0)
      prevIndex = items.length - 1
    else
      prevIndex = index - 1

    setIndex(prevIndex)
  };

  const next = () => {
    let nextIndex
    if (index === items.length - 1)
      nextIndex = 0
    else
      nextIndex = index + 1

    setIndex(nextIndex)
  };

  const item = items[index];

  const reset = () => {
    setIndex(0);
  };

  return [item, prev, next, reset] as const;
}

export default useIterator;
