import { type Decrypter, type LoadAccountByIdRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccountModel, throwError } from '@domain/test'
import { mockDecrypter, mockLoadAccountByIdRepository } from '@data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByIdRepositoryStub)

  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  describe('Method load', () => {
    describe('Decrypter integration', () => {
      test('Should call decrypt with correct accessToken', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')

        expect(decryptSpy).toHaveBeenCalledWith('any_token')
      })

      test('Should return null if decrypt returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
        const account = await sut.load('any_token', 'any_role')

        expect(account).toBeNull()
      })

      test('Should throw if decrypt throws', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')

        await expect(promise).rejects.toThrow()
      })
    })

    describe('LoadAccountByIdRepository integration', () => {
      test('Should call loadById with correct id', async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut()
        const loadAccountByIdRepositorySpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
        await sut.load('any_token', 'any_role')

        expect(loadAccountByIdRepositorySpy).toHaveBeenCalledWith('any_value', 'any_role')
      })

      test('Should return null if loadById returns null', async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
        const account = await sut.load('any_token', 'any_role')

        expect(account).toBeNull()
      })

      test('Should throw if loadById throws', async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return an account on success', async () => {
      const { sut } = makeSut()
      const account = await sut.load('any_token', 'any_role')

      expect(account).toEqual(mockAccountModel())
    })
  })
})
