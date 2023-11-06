import { type SurveyResultModel } from '@domain/models/survey-result'

export interface LoadSurveyResultBySurveyIdRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel | null>
}
