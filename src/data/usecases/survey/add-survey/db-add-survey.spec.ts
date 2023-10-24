import { type AddSurveyParams, type AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }

  return new AddSurveyRepositoryStub()
}

const makeFakeSurveyData = (): AddSurveyParams => {
  return {
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image_1',
        text: 'any_answer_1'
      },
      {
        image: 'any_image_2',
        text: 'any_answer_2'
      }
    ]
  }
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
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
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const surveyData = makeFakeSurveyData()
        await sut.add(surveyData)

        expect(addSpy).toHaveBeenLastCalledWith(surveyData)
      })

      test('Should throw if add throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
        const promise = sut.add(makeFakeSurveyData())

        await expect(promise).rejects.toThrow()
      })
    })
  })
})
