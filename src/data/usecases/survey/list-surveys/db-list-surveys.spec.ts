import { type ListSurveysRepository } from './db-list-surveys-protocols'
import { DbListSurveys } from './db-list-surveys'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@domain/test'
import { mockListSurveysRepository } from '@data/test'

type SutTypes = {
  sut: DbListSurveys
  listSurveysRepositoryStub: ListSurveysRepository
}

const buildSut = (): SutTypes => {
  const listSurveysRepositoryStub = mockListSurveysRepository()
  const sut = new DbListSurveys(listSurveysRepositoryStub)

  return {
    sut,
    listSurveysRepositoryStub
  }
}

describe('DbListSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('Method list', () => {
    describe('ListSurveysRepository integration', () => {
      test('Should call list', async () => {
        const { sut, listSurveysRepositoryStub } = buildSut()
        const listSpy = jest.spyOn(listSurveysRepositoryStub, 'list')
        await sut.list()

        expect(listSpy).toHaveBeenCalled()
      })

      test('Should throw if list throws', async () => {
        const { sut, listSurveysRepositoryStub } = buildSut()
        jest.spyOn(listSurveysRepositoryStub, 'list').mockImplementationOnce(throwError)
        const promise = sut.list()

        await expect(promise).rejects.toThrow()
      })

      test('Should return a list of surveys on success', async () => {
        const { sut } = buildSut()
        const surveys = await sut.list()

        expect(surveys).toEqual([mockSurveyModel()])
      })
    })
  })
})
