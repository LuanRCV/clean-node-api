import { type SaveSurveyResultRepository, type SurveyResultModel, type SaveSurveyResultModel, type SaveSurveyResult } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save (saveSurveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(saveSurveyResultData)
    return surveyResult
  }
}
