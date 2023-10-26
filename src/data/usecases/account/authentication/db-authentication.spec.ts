import {
  type AuthenticationParams,
  type HashComparer,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'
import { throwError } from '@domain/test'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@data/test'

const makeFakeAuthenticationData = (): AuthenticationParams => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
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
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadAccountByEmailRepositorySpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeAuthenticationData())

        expect(loadAccountByEmailRepositorySpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return null if loadByEmail returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
        const credential = await sut.auth(makeFakeAuthenticationData())

        expect(credential).toBeNull()
      })

      test('Should throw if loadByEmail throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(makeFakeAuthenticationData())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('HashComparer integration', () => {
      test('Should call compare with correct values', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAuthenticationData())

        expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
      })

      test('Should return null if compare returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(false) }))
        const credential = await sut.auth(makeFakeAuthenticationData())

        expect(credential).toBeNull()
      })

      test('Should throw if compare throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(makeFakeAuthenticationData())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Encrypter integration', () => {
      test('Should call encrypt with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeAuthenticationData())

        expect(encryptSpy).toHaveBeenCalledWith('any_id')
      })

      test('Should throw if encrypt throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(makeFakeAuthenticationData())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('UpdateAccessTokenRepository integration', () => {
      test('Should call updateAccessToken with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(makeFakeAuthenticationData())

        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_access_token')
      })

      test('Should throw if updateAccessToken throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(makeFakeAuthenticationData())

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a token on success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.auth(makeFakeAuthenticationData())

      expect(accessToken).toEqual({
        accessToken: 'any_access_token'
      })
    })
  })
})
