import { type LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { type SurveyModel } from '@domain/models/survey'
import { type LoadSurveyById } from '@domain/usecases/load-survey-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (id: string): Promise<SurveyModel | null> {
    await this.loadSurveyByIdRepository.loadById(id)
    return await new Promise(resolve => { resolve(null) })
  }
}