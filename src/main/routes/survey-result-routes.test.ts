import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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
  })
})
