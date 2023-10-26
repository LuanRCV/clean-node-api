import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { LogMongoRepository } from './log-mongo-repository'

let errorCollection: Collection

const buildSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  describe('Method logError', () => {
    test('Should create an error on success', async () => {
      const sut = buildSut()
      await sut.logError('any_error')
      const count = await errorCollection.countDocuments()

      expect(count).toBe(1)
    })
  })
})
