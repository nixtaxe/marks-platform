import LoginResponse from '@/models/LoginResponse'

export default interface IUserService {
  login(username: string, password: string): Promise<LoginResponse>
}
