import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { type SurveyModel } from '@domain/models/survey'
import { type AccountModel } from '@domain/models/account'
import MockDate from 'mockdate'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccount = async (): Promise<AccountModel> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  return MongoHelper.mapEntity<AccountModel>(result.ops[0])
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.insertOne({
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

  return MongoHelper.mapEntity<SurveyModel>(result.ops[0])
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set('1996-06-07')
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('Method save', () => {
    test('Should add a survey result if it is new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].text,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.accountId).toEqual(account.id)
      expect(surveyResult.answer).toBe(survey.answers[0].text)
      expect(surveyResult.date).toEqual(new Date())
    })

    test('Should update a survey result if it is not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].text,
        date: new Date()
      })

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].text,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.accountId).toEqual(account.id)
      expect(surveyResult.answer).toBe(survey.answers[0].text)
      expect(surveyResult.date).toEqual(new Date())
    })
  })
})
