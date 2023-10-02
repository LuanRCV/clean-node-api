import { type AccountModel, type Decrypter, type LoadAccountByIdRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (accessToken: string): Promise<string | null> {
      return await new Promise(resolve => { resolve('any_value') })
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
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
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
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
        jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
        const promise = sut.load('any_token', 'any_role')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return an account on success', async () => {
      const { sut } = makeSut()
      const account = await sut.load('any_token', 'any_role')

      expect(account).toEqual(makeFakeAccount())
    })
  })
})
