export const getExpirationDate = (millisecond: number) => {
  const currentDate = new Date()
  const expirationDate = new Date(currentDate.getTime() + millisecond)
  return expirationDate.toUTCString()
}
