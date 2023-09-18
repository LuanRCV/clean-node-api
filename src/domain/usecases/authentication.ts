import { type CredentialModel } from '../models/credential'

export interface AuthenticationModel {
  email: string
  password: string
}
export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<CredentialModel>
}
