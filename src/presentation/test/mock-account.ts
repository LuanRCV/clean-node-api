import { type CredentialModel } from '@domain/models/credential'
import { type AuthenticationParams, type Authentication } from '@domain/usecases/account/authentication'
import { type AccountModel } from '@domain/models/account'
import { mockAccountModel, mockCredentialModel } from '@domain/test'
import { type AddAccountParams, type AddAccount } from '@domain/usecases/account/add-account'
import { type LoadAccountByToken } from '@domain/usecases/account/load-account-by-token'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve, reject) => { resolve(mockAccountModel()) })
    }
  }

  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<CredentialModel | null> {
      return await new Promise(resolve => { resolve(mockCredentialModel()) })
    }
  }

  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }

  return new LoadAccountByTokenStub()
}
