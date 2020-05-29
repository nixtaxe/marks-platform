/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import LoginResponse from '@/models/LoginResponse'
import usernameLoginResponse from '@/mock/data/login/username-login-response.json'
import { load, handleSaving, getLocalStorageItem } from '@/services/helpers'

export default class FakeUserService implements IUserService {
  public async login (username: string, password: string): Promise<User> {
    if (username === 'username' && password === 'password') {
      const promise = load<LoginResponse>(usernameLoginResponse as any)
      await handleSaving(promise, 'user-info')
      return (await promise).user
    }
    return await load<User>(
      {} as any,
      'Неправильное имя пользователя или пароль',
    )
  }

  public logout (): void {
    localStorage.removeItem('user-info')
  }

  public async getUserInfo (): Promise<User> {
    const userInfo = await getLocalStorageItem<LoginResponse>('user-info')
    return userInfo.user
  }
}
