import { type CredentialModel } from '../../models/credential'

export type AuthenticationParams = {
  email: string
  password: string
}
export interface Authentication {
  auth: (authentication: AuthenticationParams) => Promise<CredentialModel | null>
}
