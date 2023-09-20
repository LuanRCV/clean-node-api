import { type CredentialModel } from '../../../domain/models/credential'
import { type AuthenticationModel, type Authentication } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/criptography/hash-comparer'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<CredentialModel | null> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      await this.hashComparer.compare(password, account.password)
    }

    return null
  }
}
