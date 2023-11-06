import { type LoadSurveyResultRepository } from '@data/protocols/db/survey-result/load-survey-result-repository'
import { type SurveyResultModel } from '@domain/models/survey-result'
import { type LoadSurveyResult } from '@domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this.loadSurveyResultRepository.load(surveyId)
    return surveyResult
  }
}
