import { type SurveyModel, type ListSurveys } from './list-surveys-controller-protocols'
import { ListSurveysController } from './list-surveys-controller'

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

interface SutTypes {
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
  test('Should call ListSurveys', async () => {
    const { sut, listSurveysStub } = makeSut()
    const listSpy = jest.spyOn(listSurveysStub, 'list')
    await sut.handle({})

    expect(listSpy).toHaveBeenCalled()
  })
})
