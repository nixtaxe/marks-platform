/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import TokenResponse from '@/models/TokenResponse'
import token from '@/mock/data/token.json'

const load = <T>(mockData: T, time = 0, error: string | null = null) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (error === null) resolve(mockData)
      else reject(error)
    }, time)
  })
}

export default class FakeUserService implements IUserService {
  public login (username: string, password: string): Promise<TokenResponse> {
    if (username === 'username' && password === 'password')
      return load<TokenResponse>(token, 1000)
    return load<TokenResponse>(
      token,
      1000,
      'Неправильное имя пользователя или пароль',
    )
  }
}
