import { type ListSurveys } from './list-surveys-controller-protocols'
import { ListSurveysController } from './list-surveys-controller'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { ServerError } from '../../../errors'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@domain/test'
import { mockListSurveys } from '@presentation/test'

type SutTypes = {
  sut: ListSurveysController
  listSurveysStub: ListSurveys
}

const buildSut = (): SutTypes => {
  const listSurveysStub = mockListSurveys()
  const sut = new ListSurveysController(listSurveysStub)

  return {
    sut,
    listSurveysStub
  }
}

describe('ListSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call ListSurveys', async () => {
    const { sut, listSurveysStub } = buildSut()
    const listSpy = jest.spyOn(listSurveysStub, 'list')
    await sut.handle({})

    expect(listSpy).toHaveBeenCalled()
  })

  test('Should return 500 if ListSurveys throws', async () => {
    const { sut, listSurveysStub } = buildSut()
    jest.spyOn(listSurveysStub, 'list').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should return 204 if ListSurveys returns empty', async () => {
    const { sut, listSurveysStub } = buildSut()
    jest.spyOn(listSurveysStub, 'list').mockReturnValueOnce(new Promise((resolve, reject) => { resolve([]) }))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.noContent())
  })

  test('Should return 200 on success', async () => {
    const { sut } = buildSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.ok([mockSurveyModel()]))
  })
})
