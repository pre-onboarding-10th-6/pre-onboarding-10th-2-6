export function debounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

export function throttle<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout | null
  return (...args: Params) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        func(...args)
      }, timeout)
    }
  }
}