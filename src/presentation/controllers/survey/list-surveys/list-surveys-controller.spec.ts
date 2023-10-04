import { type SurveyModel, type ListSurveys } from './list-surveys-controller-protocols'
import { ListSurveysController } from './list-surveys-controller'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { ServerError } from '../../../errors'
import MockDate from 'mockdate'

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image_url_1',
        text: 'any_text_1'
      },
      {
        text: 'any_text_2'
      }
    ]
  }
}

const makeListSurveys = (): ListSurveys => {
  class ListSurveysStub implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve([makeFakeSurvey()]) })
    }
  }

  return new ListSurveysStub()
}

type SutTypes = {
  sut: ListSurveysController
  listSurveysStub: ListSurveys
}

const makeSut = (): SutTypes => {
  const listSurveysStub = makeListSurveys()
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
    const { sut, listSurveysStub } = makeSut()
    const listSpy = jest.spyOn(listSurveysStub, 'list')
    await sut.handle({})

    expect(listSpy).toHaveBeenCalled()
  })

  test('Should return 500 if ListSurveys throws', async () => {
    const { sut, listSurveysStub } = makeSut()
    jest.spyOn(listSurveysStub, 'list').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should return 204 if ListSurveys returns empty', async () => {
    const { sut, listSurveysStub } = makeSut()
    jest.spyOn(listSurveysStub, 'list').mockReturnValueOnce(new Promise((resolve, reject) => { resolve([]) }))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.noContent())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.ok([makeFakeSurvey()]))
  })
})
