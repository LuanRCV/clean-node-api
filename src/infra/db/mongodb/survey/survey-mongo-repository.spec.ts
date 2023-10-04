import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { type AddSurveyModel } from '@domain/usecases/add-survey'

let surveyCollection: Collection

const makeFakeSurveyData = (): AddSurveyModel => {
  return {
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
  }
}
const makeSut = (): SurveyMongoRepository => {
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
      const sut = makeSut()
      await sut.add(makeFakeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
      expect(survey._id).toBeTruthy()
      expect(survey.question).toBe('any_question')
      expect(survey.answers).toBeTruthy()
      expect(survey.answers[0]).toEqual({
        image: 'any_image_1',
        text: 'any_answer_1'
      })
      expect(survey.answers[1]).toEqual({
        text: 'any_answer_2'
      })
    })
  })

  describe('Method list', () => {
    test('Should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.list()

      expect(surveys).toBeTruthy()
      expect(surveys.length).toBe(0)
    })

    test('Should list all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insert(makeFakeSurveyData())
      const surveys = await sut.list()

      expect(surveys).toBeTruthy()
      expect(surveys.length).toBe(1)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].answers).toBeTruthy()
      expect(surveys[0].answers[0]).toEqual({
        image: 'any_image_1',
        text: 'any_answer_1'
      })
      expect(surveys[0].answers[1]).toEqual({
        text: 'any_answer_2'
      })
    })
  })
})
