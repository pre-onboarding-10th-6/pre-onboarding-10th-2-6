import { CACHE_DURATION, CACHE_KEY } from '../assets/config'
import { instance } from '../util/axios'
import { getExpireDate } from '../util/getExpireDate'

import { IDisease } from './../types/disease'

const isCacheValid = (cachedStorageData: Response) => {
  const expired = cachedStorageData.headers.get('expire_date')

  if (expired) {
    const currentDate = new Date()
    const expiredDate = new Date(expired)
    const isCached = currentDate <= expiredDate
    return isCached
  }

  return false
}

const fetchDiseaseFromCache = async (cacheStorage: Cache, str: string) => {
  const cachedStorageData = await cacheStorage.match(str)

  if (cachedStorageData && isCacheValid(cachedStorageData)) {
    return cachedStorageData.json()
  }

  return null
}

const fetchDiseaseFromAPI = async (
  str: string,
  cacheStorage: Cache
): Promise<IDisease[]> => {
  try {
    const { data }: { data: IDisease[] } = await instance.get(
      `search-conditions/?name=${str}`
    )
    const cachedData = new Response(JSON.stringify(data), {
      headers: {
        expire_date: getExpireDate(CACHE_DURATION)
      }
    })
    await cacheStorage.put(str, cachedData)
    return data
  } catch (error) {
    throw error
  }
}

const getDisease = async (str: string) => {
  const cacheStorage = await caches.open(CACHE_KEY)
  const cachedData = await fetchDiseaseFromCache(cacheStorage, str)

  if (cachedData) {
    return cachedData
  } else {
    return fetchDiseaseFromAPI(str, cacheStorage)
  }
}

export { getDisease }
