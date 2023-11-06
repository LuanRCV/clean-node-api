import { type LoadSurveyResultBySurveyIdRepository } from './db-load-survey-result-by-survey-id-protocols'
import { DbLoadSurveyResultBySurveyId } from './db-load-survey-result-by-survey-id'
import { mockLoadSurveyResultBySurveyIdRepository } from '@data/test/mock-db-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResultBySurveyId
  loadSurveyResultRepositoryStub: LoadSurveyResultBySurveyIdRepository
}

const buildSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultBySurveyIdRepository()
  const sut = new DbLoadSurveyResultBySurveyId(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResultBySurveyId Usecase', () => {
  describe('LoadSurveyResultRepository integration', () => {
    test('Should call load with correct id', async () => {
      const { sut, loadSurveyResultRepositoryStub } = buildSut()
      const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      await sut.load('any_id')

      expect(loadSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
