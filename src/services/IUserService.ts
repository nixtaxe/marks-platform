export default interface IUserService {
  login(username: string, password: string): Promise<User>
  logout(): void
  getUserInfo(): Promise<User>
}
