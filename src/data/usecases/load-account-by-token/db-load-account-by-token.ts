import { type LoadAccountByToken, type AccountModel, type Decrypter, type LoadAccountByIdRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    const accountId = await this.decrypter.decrypt(accessToken)

    if (accountId) {
      const account = await this.loadAccountByIdRepository.loadById(accountId)

      if (account) {
        return account
      }
    }

    return null
  }
}
