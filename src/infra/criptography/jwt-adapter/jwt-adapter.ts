import jwt from 'jsonwebtoken'
import { type Encrypter } from '../../../data/protocols/criptography/encrypter'
import { type Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) { }

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (accessToken: string): Promise<string | null> {
    const jwtData: any = jwt.verify(accessToken, this.secret)
    return jwtData
  }
}
