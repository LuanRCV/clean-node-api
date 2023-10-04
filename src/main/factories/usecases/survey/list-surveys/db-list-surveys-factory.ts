import { DbListSurveys } from '@data/usecases/list-surveys/db-list-surveys'
import { SurveyMongoRepository } from '@infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbListSurveys = (): DbListSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbListSurveys(surveyMongoRepository)
}
