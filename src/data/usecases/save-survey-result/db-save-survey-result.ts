import { type SaveSurveyResultRepository } from '@data/protocols/db/survey/save-survey-result-repository'
import { type SurveyResultModel } from '@domain/models/survey-result'
import { type SaveSurveyResultModel, type SaveSurveyResult } from '@domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save (saveSurveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(saveSurveyResultData)

    return {
      id: 'any_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
  }
}
