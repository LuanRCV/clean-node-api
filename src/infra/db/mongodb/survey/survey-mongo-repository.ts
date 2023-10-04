import { type AddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository'
import { type SurveyModel, type ListSurveysRepository } from '@data/usecases/list-surveys/db-list-surveys-protocols'
import { type AddSurveyModel } from '@domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo'

export class SurveyMongoRepository implements AddSurveyRepository, ListSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async list (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys.map(survey => MongoHelper.mapEntity<SurveyModel>(survey))
  }
}
