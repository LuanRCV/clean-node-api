import { type CredentialModel } from '../../../domain/models/credential'
import { type AuthenticationModel, type Authentication } from '../../../domain/usecases/authentication'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<CredentialModel> {
    const { email } = authentication

    await this.loadAccountByEmailRepository.load(email)

    return {
      accessToken: 'any_access_token'
    }
  }
}
