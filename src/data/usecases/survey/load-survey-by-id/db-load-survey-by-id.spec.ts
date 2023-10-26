import { type LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@domain/test'
import { mockLoadSurveyByIdRepository } from '@data/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const buildSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('Method load', () => {
    describe('LoadSurveyByIdRepository integration', () => {
      test('Should call loadById with correct id', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = buildSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.load('any_id')

        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
      })

      test('Should return null if loadById returns null', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = buildSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
        const survey = await sut.load('any_id')

        expect(survey).toBeNull()
      })

      test('Should throw if loadById throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = buildSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.load('any_id')

        await expect(promise).rejects.toThrow()
      })
    })

    test('Should return a survey on success', async () => {
      const { sut } = buildSut()
      const survey = await sut.load('any_id')

      expect(survey).toEqual(mockSurveyModel())
    })
  })
})
