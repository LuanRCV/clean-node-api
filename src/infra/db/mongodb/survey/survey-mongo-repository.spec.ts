import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddSurveyParams } from '@domain/test'

let surveyCollection: Collection

const buildSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Method add', () => {
    test('Should add a survey on success', async () => {
      const sut = buildSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
      expect(survey._id).toBeTruthy()
      expect(survey.question).toBe('any_question')
      expect(survey.answers).toBeTruthy()
      expect(survey.answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1'
      })
      expect(survey.answers[1]).toEqual({
        text: 'any_text_2'
      })
    })
  })

  describe('Method list', () => {
    test('Should load an empty list', async () => {
      const sut = buildSut()
      const surveys = await sut.list()

      expect(surveys).toBeTruthy()
      expect(surveys.length).toBe(0)
    })

    test('Should list all surveys on success', async () => {
      const sut = buildSut()
      await surveyCollection.insert(mockAddSurveyParams())
      const surveys = await sut.list()

      expect(surveys).toBeTruthy()
      expect(surveys.length).toBe(1)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].answers).toBeTruthy()
      expect(surveys[0].answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1'
      })
      expect(surveys[0].answers[1]).toEqual({
        text: 'any_text_2'
      })
    })
  })

  describe('Method loadById', () => {
    test('Should return null on fail', async () => {
      const sut = buildSut()
      const survey = await sut.loadById(new ObjectId().toString())

      expect(survey).toBeNull()
    })

    test('Should return a survey on success', async () => {
      const sut = buildSut()
      const result = await surveyCollection.insertOne(mockAddSurveyParams())
      const newSurvey = result.ops[0]
      const survey = await sut.loadById(newSurvey._id)

      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
      expect(survey?.question).toBe('any_question')
      expect(survey?.answers).toBeTruthy()
      expect(survey?.answers[0]).toEqual({
        image: 'any_image_url_1',
        text: 'any_text_1'
      })
      expect(survey?.answers[1]).toEqual({
        text: 'any_text_2'
      })
    })
  })
})
