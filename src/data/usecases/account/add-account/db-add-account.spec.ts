import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@data/test'
import { type AddAccountRepository, type Hasher, type LoadAccountByEmailRepository } from './db-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@domain/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(new Promise(resolve => { resolve(null) }))
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  describe('Method add', () => {
    describe('LoadAccountByEmailRepository integration', () => {
      test('Should call loadByEmail with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadAccountByEmailRepositorySpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(mockAddAccountParams())

        expect(loadAccountByEmailRepositorySpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return null if loadByEmail returns some account', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(mockAccountModel()) }))
        const account = await sut.add(mockAddAccountParams())

        expect(account).toBeNull()
      })

      test('Should throw if loadByEmail throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Hasher integration', () => {
      test('Should call hash with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const hashSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(mockAddAccountParams())

        expect(hashSpy).toHaveBeenCalledWith('any_password')
      })

      test('Should throw if hash throws', async () => {
        const { sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())

        await expect(promise).rejects.toThrow()
      })
    })

    describe('AddAccountRepository integration', () => {
      test('Should call add with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(mockAddAccountParams())

        expect(addSpy).toHaveBeenCalledWith({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        })
      })

      test('Should throw if add throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return an account on success', async () => {
      const { sut } = makeSut()
      const account = await sut.add(mockAddAccountParams())

      expect(account).toEqual(mockAccountModel())
    })
  })
})
