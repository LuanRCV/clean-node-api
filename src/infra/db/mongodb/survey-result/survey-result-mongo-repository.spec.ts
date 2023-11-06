import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { type SurveyModel } from '@domain/models/survey'
import { type AccountModel } from '@domain/models/account'
import MockDate from 'mockdate'
import { mockAddAccountParams, mockAddSurveyParams } from '@domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const insertMockedAccount = async (): Promise<AccountModel> => {
  const result = await accountCollection.insertOne(mockAddAccountParams())

  return MongoHelper.mapEntity<AccountModel>(result.ops[0])
}

const insertMockedSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.insertOne(mockAddSurveyParams())

  return MongoHelper.mapEntity<SurveyModel>(result.ops[0])
}

const buildSut = (): SurveyResultMongoRepository => {
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
      const sut = buildSut()
      const survey = await insertMockedSurvey()
      const account = await insertMockedAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id.toString(),
        accountId: account.id.toString(),
        answer: survey.answers[0].text,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.question).toEqual(survey.question)
      expect(surveyResult?.answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1',
        count: 1,
        percent: 100
      })
      expect(surveyResult?.answers[1]).toEqual({
        text: 'any_text_2',
        count: 0,
        percent: 0
      })
      expect(surveyResult?.date).toEqual(new Date())
    })

    test('Should update a survey result if it is not new', async () => {
      const sut = buildSut()
      const survey = await insertMockedSurvey()
      const account = await insertMockedAccount()
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.mapObjectId(survey.id),
        accountId: MongoHelper.mapObjectId(account.id),
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
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.question).toEqual(survey.question)
      expect(surveyResult?.answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1',
        count: 1,
        percent: 100
      })
      expect(surveyResult?.answers[1]).toEqual({
        text: 'any_text_2',
        count: 0,
        percent: 0
      })
      expect(surveyResult?.date).toEqual(new Date())
    })
  })

  describe('Method loadBySurveyId', () => {
    test('Should return null on fail', async () => {
      const sut = buildSut()
      const surveyResult = await sut.loadBySurveyId(new ObjectId().toString())

      expect(surveyResult).toBeNull()
    })

    test('Should return a survey result on success', async () => {
      const sut = buildSut()
      const survey = await insertMockedSurvey()
      const account = await insertMockedAccount()

      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.mapObjectId(survey.id),
          accountId: MongoHelper.mapObjectId(account.id),
          answer: survey.answers[0].text,
          date: new Date()
        },
        {
          surveyId: MongoHelper.mapObjectId(survey.id),
          accountId: MongoHelper.mapObjectId(account.id),
          answer: survey.answers[0].text,
          date: new Date()
        },
        {
          surveyId: MongoHelper.mapObjectId(survey.id),
          accountId: MongoHelper.mapObjectId(account.id),
          answer: survey.answers[0].text,
          date: new Date()
        },
        {
          surveyId: MongoHelper.mapObjectId(survey.id),
          accountId: MongoHelper.mapObjectId(account.id),
          answer: survey.answers[1].text,
          date: new Date()
        }
      ])

      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.question).toEqual(survey.question)
      console.log(surveyResult)
      expect(surveyResult?.answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1',
        count: 3,
        percent: 75
      })
      expect(surveyResult?.answers[1]).toEqual({
        text: 'any_text_2',
        count: 1,
        percent: 25
      })
      expect(surveyResult?.date).toEqual(new Date())
    })
  })
})
