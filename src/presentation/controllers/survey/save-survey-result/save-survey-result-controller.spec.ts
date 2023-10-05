import { type Validation, type HttpRequest } from './save-survey-result-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      date: new Date(),
      answers: [
        {
          image: 'any_image_1',
          text: 'any_answer_1'
        },
        {
          text: 'any_answer_2'
        }
      ]
    }
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new SaveSurveyResultController(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('SaveSurveyResult Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })
})
