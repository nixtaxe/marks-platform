/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import LoginResponse from '@/models/LoginResponse'
import usernameLoginResponse from '@/mock/data/login/username-login-response.json'

const load = <T>(mockData: T, error: string | null = null, time = 1000) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (error === null) {
        localStorage.setItem('user-info', JSON.stringify(mockData))
        resolve(mockData)
      } else reject(error)
    }, time)
  })
}

const getLocalStorageItem = <T>(itemName: string) => {
  return new Promise<T>((resolve, reject) => {
    const resultString: string | null = localStorage.getItem(itemName)
    if (resultString) resolve(JSON.parse(resultString))
    else reject('Not found')
  })
}

export default class FakeUserService implements IUserService {
  public login (username: string, password: string): Promise<LoginResponse> {
    if (username === 'username' && password === 'password')
      return load<LoginResponse>(usernameLoginResponse)
    return load<LoginResponse>(
      usernameLoginResponse,
      'Неправильное имя пользователя или пароль',
    )
  }

  public logout (): void {
    localStorage.removeItem('user-info')
  }

  public getUserInfo (): Promise<LoginResponse> {
    return getLocalStorageItem<LoginResponse>('user-info')
  }
}
