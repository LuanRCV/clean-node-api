import { type LoadSurveyResultRepository, type SurveyResultModel, type LoadSurveyResult } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this.loadSurveyResultRepository.load(surveyId)
    return surveyResult
  }
}
