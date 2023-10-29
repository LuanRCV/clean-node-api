import { type SurveyResultModel } from '@domain/models/survey-result'
import { type SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel | null>
}
