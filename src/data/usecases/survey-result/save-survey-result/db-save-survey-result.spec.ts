import { type SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '@domain/test'
import { mockSaveSurveyResultRepository } from '@data/test/mock-db-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const buildSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('SaveSurveyResultRepository integration', () => {
    test('Should call save with correct values', async () => {
      const { sut, saveSurveyResultRepositoryStub } = buildSut()
      const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      const saveSurveyData = mockSaveSurveyResultParams()
      await sut.save(saveSurveyData)

      expect(saveSpy).toHaveBeenCalledWith(saveSurveyData)
    })

    test('Should throw if save throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = buildSut()
      jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
      const promise = sut.save(mockSaveSurveyResultParams())

      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a SurveyResult on success', async () => {
    const { sut } = buildSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
