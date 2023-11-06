import { type LoadSurveyResultRepository } from '@data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@data/test/mock-db-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const buildSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  describe('LoadSurveyResultRepository integration', () => {
    test('Should call load with correct id', async () => {
      const { sut, loadSurveyResultRepositoryStub } = buildSut()
      const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'load')
      await sut.load('any_id')

      expect(loadSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
