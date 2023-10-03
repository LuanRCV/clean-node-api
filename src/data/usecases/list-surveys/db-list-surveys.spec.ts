import { type SurveyModel, type ListSurveysRepository } from './db-list-surveys-protocols'
import { DbListSurveys } from './db-list-surveys'

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

const makeListSurveysRepository = (): ListSurveysRepository => {
  class ListSurveysRepositoryStub implements ListSurveysRepository {
    async list (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve([makeFakeSurvey()]) })
    }
  }

  return new ListSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbListSurveys
  listSurveysRepositoryStub: ListSurveysRepository
}

const makeSut = (): SutTypes => {
  const listSurveysRepositoryStub = makeListSurveysRepository()
  const sut = new DbListSurveys(listSurveysRepositoryStub)

  return {
    sut,
    listSurveysRepositoryStub
  }
}

describe('DbListSurveys Usecase', () => {
  describe('Method list', () => {
    describe('ListSurveysRepository integration', () => {
      test('Should call list', async () => {
        const { sut, listSurveysRepositoryStub } = makeSut()
        const listSpy = jest.spyOn(listSurveysRepositoryStub, 'list')
        await sut.list()

        expect(listSpy).toHaveBeenCalled()
      })

      test('Should throw if list throws', async () => {
        const { sut, listSurveysRepositoryStub } = makeSut()
        jest.spyOn(listSurveysRepositoryStub, 'list').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
        const promise = sut.list()

        await expect(promise).rejects.toThrow()
      })
    })
  })
})
