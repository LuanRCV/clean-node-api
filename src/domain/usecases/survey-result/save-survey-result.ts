import { type SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (saveSurveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
