import { type AddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository'
import { type LoadSurveyByIdRepository } from '@data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { type ListSurveysRepository } from '@data/usecases/survey/list-surveys/db-list-surveys-protocols'
import { type AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { type SurveyModel } from '@domain/models/survey'
import { MongoHelper } from '../helpers/mongo'

export class SurveyMongoRepository implements AddSurveyRepository, ListSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async list (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys.map(survey => MongoHelper.mapEntity<SurveyModel>(survey))
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const _id = MongoHelper.mapObjectId(id)
    const survey = await surveyCollection.findOne({ _id })

    if (survey) {
      return MongoHelper.mapEntity<SurveyModel>(survey)
    }

    return null
  }
}
