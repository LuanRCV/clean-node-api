import { type SurveyModel, type ListSurveys, type ListSurveysRepository } from './db-list-surveys-protocols'

export class DbListSurveys implements ListSurveys {
  constructor (
    private readonly listSurveysRepository: ListSurveysRepository
  ) { }

  async list (): Promise<SurveyModel[]> {
    const surveys = await this.listSurveysRepository.list()
    return surveys
  }
}
