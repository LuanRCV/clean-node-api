import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo'
import { type Collection } from 'mongodb'
import jwt from 'jsonwebtoken'
import env from '../config/env'
import { mockAddAccountParams } from '@domain/test'
import { type AccountModel } from '@domain/models/account'

let surveyCollection: Collection
let accountCollection: Collection

const insertMockedAccount = async (): Promise<AccountModel> => {
  const result = await accountCollection.insertOne(mockAddAccountParams())

  return MongoHelper.mapEntity<AccountModel>(result.ops[0])
}

const updateAccessToken = async (): Promise<string> => {
  const account = await insertMockedAccount()
  const { id } = account
  const accessToken = jwt.sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await updateAccessToken()
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        date: new Date(),
        answers: [
          {
            image: 'any_image_1',
            text: 'any_text_1'
          },
          {
            text: 'any_text_2'
          }
        ]
      })
      const surveyId = res.ops[0]._id as string

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_text_1'
        })
        .expect(200)
    })
  })
})
