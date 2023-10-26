import { type AccountModel } from '@domain/models/account'
import { type AddAccountParams } from '@domain/usecases/account/add-account'
import { type AuthenticationParams } from '@domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export const mockAddAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export const mockAuthentication = (): AuthenticationParams => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
