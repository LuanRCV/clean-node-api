import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { throwError } from '@domain/test'

jest.mock('bcrypt', () => ({
  async hash (data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  },
  async compare (data: string | Buffer, encrypted: string): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

const salt = 12
const buildSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('Method hash', () => {
    describe('bcrypt integration', () => {
      test('Should call hash with correct values', async () => {
        const sut = buildSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
      })

      test('Should throw if hash throws', async () => {
        const sut = buildSut()
        type BcryptHashSpy = (data: string | Buffer, saltOrRounds: string | number) => Promise<string>
        const bcryptHashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.MockedFunction<BcryptHashSpy>
        bcryptHashSpy.mockImplementationOnce(throwError)
        const promise = sut.hash('any_value')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a hash on success', async () => {
      const sut = buildSut()
      const hash = await sut.hash('any_value')

      expect(hash).toBe('hash')
    })
  })

  describe('Method compare', () => {
    describe('bcrypt integration', () => {
      test('Should call compare with correct values', async () => {
        const sut = buildSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')

        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
      })

      test('Should return false on compare fail', async () => {
        const sut = buildSut()
        type BcryptCompareSpy = (data: string | Buffer, encrypted: string) => Promise<boolean>
        const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.MockedFunction<BcryptCompareSpy>
        bcryptCompareSpy.mockReturnValueOnce(new Promise((resolve, reject) => { resolve(false) }))
        const isValid = await sut.compare('any_value', 'any_hash')

        expect(isValid).toBe(false)
      })

      test('Should throw if compare throws', async () => {
        const sut = buildSut()
        type BcryptCompareSpy = (data: string | Buffer, encrypted: string) => Promise<boolean>
        const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.MockedFunction<BcryptCompareSpy>
        bcryptCompareSpy.mockImplementationOnce(throwError)
        const promise = sut.compare('any_value', 'any_hash')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return true on success', async () => {
      const sut = buildSut()
      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(true)
    })
  })
})
