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
  const result = await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { role: 'admin' }))

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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image_1',
              text: 'any_answer_1'
            },
            {
              text: 'any_answer_2'
            }
          ]
        })
        .expect(403)
    })

    test('Should return 204 on add with valid accessToken', async () => {
      const accessToken = await updateAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image_1',
              text: 'any_answer_1'
            },
            {
              text: 'any_answer_2'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on list surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on list surveys with valid accessToken and not empty list of surveys', async () => {
      const accessToken = await updateAccessToken()
      await surveyCollection.insertOne({
        question: 'any_question',
        date: new Date(),
        answers: [
          {
            image: 'any_image_1',
            text: 'any_answer_1'
          },
          {
            text: 'any_answer_2'
          }
        ]
      })

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should return 204 on list surveys with valid accessToken and empty list of surveys', async () => {
      const accessToken = await updateAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
