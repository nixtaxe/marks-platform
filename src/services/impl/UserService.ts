import IUserService from '@/services/IUserService'
import httpClient from '@/services/HttpClient'
import LoginQuery from '@/services/impl/graphql/LoginQuery.ts'
import LoginResponse from '@/models/LoginResponse'
import { getLocalStorageItem, saveToLocalStorage } from '@/services/helpers'
import GetUserQuery from './graphql/GetUserQuery'

export default class UserService implements IUserService {
  async login (username: string, password: string): Promise<User> {
    const loginResult = await httpClient.mutate({
      mutation: LoginQuery,
      variables: { username, password },
    })

    const result = {
      jwt: <string>loginResult.data.data.jwt,
      user: <User>loginResult.data.data.user,
    }
    saveToLocalStorage<LoginResponse>(result, 'user-info')

    return result.user
  }

  logout (): void {
    localStorage.removeItem('user-info')
  }

  async getUserInfo (): Promise<User> {
    const userInfo = await getLocalStorageItem<LoginResponse>('user-info')

    const userResult = await httpClient.query({
      query: GetUserQuery,
      variables: { id: userInfo.user.id },
    })

    const result = {
      jwt: <string>userInfo.jwt,
      user: <User>userResult.data.data,
    }
    saveToLocalStorage<LoginResponse>(result, 'user-info')

    return result.user
  }
}
