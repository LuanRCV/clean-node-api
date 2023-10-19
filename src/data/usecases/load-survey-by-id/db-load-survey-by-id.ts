import { type LoadSurveyByIdRepository, type SurveyModel, type LoadSurveyById } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (id: string): Promise<SurveyModel | null> {
    await this.loadSurveyByIdRepository.loadById(id)
    return await new Promise(resolve => { resolve(null) })
  }
}
