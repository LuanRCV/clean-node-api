import { type SurveyModel } from '@domain/models/survey'
import { type ListSurveys } from '@domain/usecases/survey/list-surveys'
import { mockSurveyModel } from '@domain/test'
import { type AddSurvey, type AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { type LoadSurveyById } from '@domain/usecases/survey/load-survey-by-id'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (surveyData: AddSurveyParams): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }

  return new AddSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel | null> {
      return await new Promise(resolve => { resolve(mockSurveyModel()) })
    }
  }

  return new LoadSurveyByIdStub()
}

export const mockListSurveys = (): ListSurveys => {
  class ListSurveysStub implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve([mockSurveyModel()]) })
    }
  }

  return new ListSurveysStub()
}
