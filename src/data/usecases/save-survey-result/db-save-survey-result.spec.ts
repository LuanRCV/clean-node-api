import { type SaveSurveyResultRepository } from '@data/protocols/db/survey/save-survey-result-repository'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { type SurveyResultModel } from '@domain/models/survey-result'
import { type SaveSurveyResultModel } from '@domain/usecases/save-survey-result'

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (saveSurveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => { resolve(makeFakeSurveyResult()) })
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  describe('SaveSurveyResultRepository integration', () => {
    test('Should call save with correct values', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      const saveSurveyData = makeFakeSaveSurveyResult()
      await sut.save(saveSurveyData)

      expect(saveSpy).toHaveBeenCalledWith(saveSurveyData)
    })

    test('Should throw if save throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
      const promise = sut.save(makeFakeSaveSurveyResult())

      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSaveSurveyResult())

    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
