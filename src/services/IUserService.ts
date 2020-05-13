import TokenResponse from '@/models/TokenResponse'

export default interface IUserService {
  login(): Promise<TokenResponse>
}
