import { type AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import { mockAddSurveyParams, throwError } from '@domain/test'
import { mockAddSurveyRepository } from '@data/test'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const buildSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  describe('Method add', () => {
    describe('AddSurveyRepository integration', () => {
      test('Should call add with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = buildSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const surveyData = mockAddSurveyParams()
        await sut.add(surveyData)

        expect(addSpy).toHaveBeenLastCalledWith(surveyData)
      })

      test('Should throw if add throws', async () => {
        const { sut, addSurveyRepositoryStub } = buildSut()
        jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
        const promise = sut.add(mockAddSurveyParams())

        await expect(promise).rejects.toThrow()
      })
    })
  })
})
