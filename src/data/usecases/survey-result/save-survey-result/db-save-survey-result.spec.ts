import { type SaveSurveyResultRepository, type SurveyResultModel, type SaveSurveyResultParams } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

const makeFakeSaveSurveyResult = (): SaveSurveyResultParams => {
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
    async save (saveSurveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
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
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

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
