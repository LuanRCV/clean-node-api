import { type LoadSurveyResultBySurveyIdRepository, type SurveyResultModel, type LoadSurveyResultBySurveyId } from './db-load-survey-result-by-survey-id-protocols'

export class DbLoadSurveyResultBySurveyId implements LoadSurveyResultBySurveyId {
  constructor (
    private readonly loadSurveyResultBySurveyIdRepository: LoadSurveyResultBySurveyIdRepository
  ) { }

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this.loadSurveyResultBySurveyIdRepository.loadBySurveyId(surveyId)
    return surveyResult
  }
}
