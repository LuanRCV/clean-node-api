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
    test('Should call loadBySurveyId with correct id', async () => {
      const { sut, loadSurveyResultRepositoryStub } = buildSut()
      const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      await sut.load('any_id')

      expect(loadSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return null if loadBySurveyId returns null', async () => {
      const { sut, loadSurveyResultRepositoryStub } = buildSut()
      jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
      const surveyResult = await sut.load('any_id')

      expect(surveyResult).toBeNull()
    })
  })
})
