export const getExpireDate = (cacheTime: number) => {
  const currentDate = new Date()
  const expirationDate = new Date(currentDate.getTime() + cacheTime)
  return expirationDate.toUTCString()
}
