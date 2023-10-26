import jwt, { type VerifyOptions, type Secret, type SignOptions, type JwtPayload } from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (payload: string | Buffer | object, secretOrPrivateKey: Secret, options?: SignOptions): string {
    return 'any_token'
  },

  verify (token: string, secretOrPublicKey: Secret, options: VerifyOptions & { complete: true }): JwtPayload {
    return {
      id: 'any_id'
    }
  }
}))

const jwtSecret = 'secret'
const buildSut = (): JwtAdapter => {
  return new JwtAdapter(jwtSecret)
}

describe('Jwt Adapter', () => {
  describe('Method encrypt', () => {
    describe('jsonwebtoken integration', () => {
      test('Should call sign with correct values', async () => {
        const sut = buildSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')

        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
      })

      test('Should throw if sign throws', async () => {
        const sut = buildSut()
        type JwtSignSpy = (payload: string | Buffer | object, secretOrPrivateKey: Secret, options?: SignOptions) => string
        const jwtSignSpy = jest.spyOn(jwt, 'sign') as unknown as jest.MockedFunction<JwtSignSpy>
        jwtSignSpy.mockImplementationOnce((payload: string | Buffer | object, secretOrPrivateKey: Secret, options?: SignOptions) => { throw new Error() })
        const promise = sut.encrypt('any_id')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a token on success', async () => {
      const sut = buildSut()
      const token = await sut.encrypt('any_id')

      expect(token).toBe('any_token')
    })
  })

  describe('Method decrypt', () => {
    describe('jsonwebtoken integration', () => {
      test('Should call verify with correct values', async () => {
        const sut = buildSut()
        const verifySpy = jest.spyOn(jwt, 'verify')
        await sut.decrypt('any_token')

        expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
      })

      test('Should throw if verify throws', async () => {
        const sut = buildSut()
        type JwtVerifySpy = (token: string, secretOrPublicKey: Secret, options: VerifyOptions & { complete: true }) => string
        const jwtSignSpy = jest.spyOn(jwt, 'verify') as unknown as jest.MockedFunction<JwtVerifySpy>
        jwtSignSpy.mockImplementationOnce((token: string, secretOrPublicKey: Secret, options: VerifyOptions & { complete: true }) => { throw new Error() })
        const promise = sut.decrypt('any_token')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a value on success', async () => {
      const sut = buildSut()
      const value = await sut.decrypt('any_token')

      expect(value).toBe('any_id')
    })
  })
})
