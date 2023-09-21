import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    accountData.password = hashedPassword

    const account = await this.addAccountRepository.add(accountData)

    return account
  }
}
