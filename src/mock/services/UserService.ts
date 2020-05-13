/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import TokenResponse from '@/models/TokenResponse'
import token from '@/mock/data/token.json'

const load = <T>(mockData: T, time = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default class FakeUserService implements IUserService {
  public login (username: string, password: string): Promise<TokenResponse> {
    return load<TokenResponse>(token, 1000)
  }
}
