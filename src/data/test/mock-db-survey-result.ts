import { type SaveSurveyResultRepository } from '@data/protocols/db/survey-result/save-survey-result-repository'
import { type SurveyResultModel } from '@domain/models/survey-result'
import { mockSurveyResultModel } from '@domain/test'
import { type SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (saveSurveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise((resolve) => { resolve(mockSurveyResultModel()) })
    }
  }

  return new SaveSurveyResultRepositoryStub()
}
