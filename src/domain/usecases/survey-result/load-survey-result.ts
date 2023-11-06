import { type SurveyResultModel } from '@domain/models/survey-result'

export interface LoadSurveyResultBySurveyId {
  load: (surveyId: string) => Promise<SurveyResultModel | null>
}
