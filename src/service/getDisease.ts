import { CACHE_DURATION, CACHE_KEY } from '../assets/config'
import { instance } from '../util/axios'
import { getExpireDate } from '../util/getExpireDate'

const getDisease = async (str: string) => {
  const cacheStorage = await caches.open(CACHE_KEY)

  const cachedStorageData = await cacheStorage.match(str)

  if (cachedStorageData) {
    console.log('cachedStorageData')
    const expired = cachedStorageData.headers.get('expire_date')
    const cachedData = cachedStorageData.json()

    if (expired) {
      const currentDate = new Date()
      const expiredDate = new Date(expired)
      console.log('currentDate <= expiredDate', currentDate <= expiredDate)
      console.log('currentDate', currentDate)
      console.log('expiredDate', expiredDate)
      if (currentDate <= expiredDate) {
        console.log('캐쉬되어있음', getExpireDate(CACHE_DURATION))
        cachedStorageData.headers.set(
          'expire_date',
          getExpireDate(CACHE_DURATION)
        )
        return cachedData
      } else {
        console.log('만료되었음')
        return fetchDisese(str, cacheStorage)
      }
    }
  } else {
    console.log('캐슁된적 없음')
    return fetchDisese(str, cacheStorage)
  }
}

const fetchDisese = async (str: string, cacheStorage: Cache) => {
  console.log('api call api 호출함')
  const { data } = await instance.get(`search-conditions/?name=${str}`)
  const cachedData = new Response(JSON.stringify(data), {
    headers: {
      expire_date: getExpireDate(CACHE_DURATION)
    }
  })
  await cacheStorage.put(str, cachedData)
  return data
}

export { getDisease }
