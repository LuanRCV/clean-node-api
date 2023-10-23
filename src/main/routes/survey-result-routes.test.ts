import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo'
import { type Collection } from 'mongodb'
import jwt from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password'
  })

  const id = result.ops[0]._id
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
        .put('/api/surveys/any_id/result')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
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
        .put(`/api/surveys/${surveyId}/result`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_text_1'
        })
        .expect(200)
    })
  })
})
