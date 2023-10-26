import { type AddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository'
import { type ListSurveysRepository } from '@data/protocols/db/survey/list-surveys-repository'
import { type LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { type SurveyModel } from '@domain/models/survey'
import { mockSurveyModel } from '@domain/test'
import { type AddSurveyParams } from '@domain/usecases/survey/add-survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }

  return new AddSurveyRepositoryStub()
}

export const mockListSurveysRepository = (): ListSurveysRepository => {
  class ListSurveysRepositoryStub implements ListSurveysRepository {
    async list (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve([mockSurveyModel()]) })
    }
  }

  return new ListSurveysRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await new Promise(resolve => { resolve(mockSurveyModel()) })
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}
