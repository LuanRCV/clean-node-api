import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { AccountMongoRepository } from './account-mongo-repository'
import { mockAddAccountParams } from '@domain/test'

let accountCollection: Collection

const buildSut = (): AccountMongoRepository => {
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
      const sut = buildSut()
      const account = await sut.add(mockAddAccountParams())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('Method loadByEmail', () => {
    test('Should return null on fail', async () => {
      const sut = buildSut()
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const sut = buildSut()
      await accountCollection.insertOne(mockAddAccountParams())
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
      const sut = buildSut()
      const account = await sut.loadById('any_id')

      expect(account).toBeNull()
    })

    test('Should return an account without role with success', async () => {
      const sut = buildSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const newAccount = result.ops[0]
      const account = await sut.loadById(newAccount._id)

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return null with invalid role', async () => {
      const sut = buildSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const newAccount = result.ops[0]
      const account = await sut.loadById(newAccount._id, 'admin')

      expect(account).toBeNull()
    })

    test('Should return an account with admin role with success', async () => {
      const sut = buildSut()
      const result = await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { role: 'admin' }))
      const newAccount = result.ops[0]
      const account = await sut.loadById(newAccount._id, 'admin')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
      expect(account?.role).toBe('admin')
    })

    test('Should return an account if user is admin', async () => {
      const sut = buildSut()
      const result = await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { role: 'admin' }))
      const newAccount = result.ops[0]
      const account = await sut.loadById(newAccount._id)

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
      expect(account?.role).toBe('admin')
    })
  })

  describe('Method updateAccessToken', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = buildSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())

      let account = result.ops[0]
      expect(account.accessToken).toBeFalsy()
      await sut.updateAccessToken(account._id, 'any_token')
      account = await accountCollection.findOne({ _id: account._id })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
