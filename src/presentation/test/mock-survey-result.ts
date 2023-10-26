import { type SurveyResultModel } from '@domain/models/survey-result'
import { mockSurveyResultModel } from '@domain/test'
import { type SaveSurveyResult, type SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (saveSurveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise(resolve => { resolve(mockSurveyResultModel()) })
    }
  }

  return new SaveSurveyResultStub()
}
