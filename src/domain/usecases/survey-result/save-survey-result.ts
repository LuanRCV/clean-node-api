import { type SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (saveSurveyResultData: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
