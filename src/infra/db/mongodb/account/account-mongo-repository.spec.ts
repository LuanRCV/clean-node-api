import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Method add', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()

      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('Method loadByEmail', () => {
    test('Should return null on fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
  })

  describe('Method loadById', () => {
    test('Should return null on fail', async () => {
      const sut = makeSut()
      const account = await sut.loadById('651b1652649fa6170c7a3a30')

      expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const newAccount = result.ops[0]
      const account = await sut.loadById(newAccount._id)

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
  })

  describe('Method updateAccessToken', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      let account = result.ops[0]
      expect(account.accessToken).toBeFalsy()
      await sut.updateAccessToken(account._id, 'any_token')
      account = await accountCollection.findOne({ _id: account._id })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
