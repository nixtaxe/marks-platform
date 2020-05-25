export const load = <T>(
  mockData: T,
  error: string | null = null,
  time = 1000,
) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (error === null) resolve(mockData)
      else reject(error)
    }, time)
  })
}

export const handleSaving = async <T>(promise: Promise<T>, name: string) => {
  const data = await promise
  saveToLocalStorage<T>(data, name)
}

export const saveToLocalStorage = <T>(data: T, name: string) =>
  localStorage.setItem(name, JSON.stringify(data))

export const getLocalStorageItem = <T>(itemName: string) => {
  return new Promise<T>((resolve, reject) => {
    const resultString: string | null = localStorage.getItem(itemName)
    if (resultString) resolve(JSON.parse(resultString))
    else reject('Not found')
  })
}
