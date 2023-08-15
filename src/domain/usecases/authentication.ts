import { type CredentialModel } from '../models/credential'

export interface Authentication {
  auth: (email: string, password: string) => Promise<CredentialModel>
}
