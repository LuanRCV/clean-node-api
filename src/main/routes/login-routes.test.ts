import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo'
import { type Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 401 with invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_mail@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })

    test('Should return 200 on login', async () => {
      const hashedPassword = await hash('any_password', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: hashedPassword
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'any_mail@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })
  })
})
