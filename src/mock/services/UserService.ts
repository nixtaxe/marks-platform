/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import LoginResponse from '@/models/LoginResponse'
import usernameLoginResponse from '@/mock/data/login/username-login-response.json'
import { load, handleSaving, getLocalStorageItem } from '@/mock/helpers'

export default class FakeUserService implements IUserService {
  public login (username: string, password: string): Promise<LoginResponse> {
    if (username === 'username' && password === 'password') {
      const promise = load<LoginResponse>(usernameLoginResponse)
      handleSaving(promise, 'user-info')
      return promise
    }
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
