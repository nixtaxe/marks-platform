import TokenResponse from '@/models/TokenResponse'

export default interface IUserService {
  login(username: string, password: string): Promise<TokenResponse>
}
