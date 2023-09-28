import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository, type LoadAccountByEmailRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const { email, password } = accountData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (!account) {
      const hashedPassword = await this.hasher.hash(password)
      accountData.password = hashedPassword

      const newAccount = await this.addAccountRepository.add(accountData)

      return newAccount
    }

    return null
  }
}
