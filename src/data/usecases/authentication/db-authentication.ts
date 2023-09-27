import {
  type Authentication,
  type AuthenticationModel,
  type HashComparer,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenRepository,
  CredentialModel
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth(authentication: AuthenticationModel): Promise<CredentialModel | null> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isTheSamePassword = await this.hashComparer.compare(password, account.password)

      if (isTheSamePassword) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

        return { accessToken }
      }
    }

    return null
  }
}
