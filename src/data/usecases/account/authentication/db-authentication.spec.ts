import {
  type HashComparer,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'
import { mockAuthentication, throwError } from '@domain/test'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const buildSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  describe('Method auth', () => {
    describe('LoadAccountByEmailRepository integration', () => {
      test('Should call loadByEmail with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = buildSut()
        const loadAccountByEmailRepositorySpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(mockAuthentication())

        expect(loadAccountByEmailRepositorySpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return null if loadByEmail returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = buildSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
        const credential = await sut.auth(mockAuthentication())

        expect(credential).toBeNull()
      })

      test('Should throw if loadByEmail throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = buildSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('HashComparer integration', () => {
      test('Should call compare with correct values', async () => {
        const { sut, hashComparerStub } = buildSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(mockAuthentication())

        expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
      })

      test('Should return null if compare returns false', async () => {
        const { sut, hashComparerStub } = buildSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(false) }))
        const credential = await sut.auth(mockAuthentication())

        expect(credential).toBeNull()
      })

      test('Should throw if compare throws', async () => {
        const { sut, hashComparerStub } = buildSut()
        jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Encrypter integration', () => {
      test('Should call encrypt with correct id', async () => {
        const { sut, encrypterStub } = buildSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(mockAuthentication())

        expect(encryptSpy).toHaveBeenCalledWith('any_id')
      })

      test('Should throw if encrypt throws', async () => {
        const { sut, encrypterStub } = buildSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('UpdateAccessTokenRepository integration', () => {
      test('Should call updateAccessToken with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = buildSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(mockAuthentication())

        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_access_token')
      })

      test('Should throw if updateAccessToken throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = buildSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a token on success', async () => {
      const { sut } = buildSut()
      const accessToken = await sut.auth(mockAuthentication())

      expect(accessToken).toEqual({
        accessToken: 'any_access_token'
      })
    })
  })
})
