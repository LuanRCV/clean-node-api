import { type CredentialModel } from '../models/credential'

export type AuthenticationModel = {
  email: string
  password: string
}
export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<CredentialModel | null>
}
