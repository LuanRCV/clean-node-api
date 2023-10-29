import { type SaveSurveyResultRepository, type SurveyResultModel, type SaveSurveyResultParams, type SaveSurveyResult } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save (saveSurveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    const surveyResult = await this.saveSurveyResultRepository.save(saveSurveyResultData)
    return surveyResult
  }
}
