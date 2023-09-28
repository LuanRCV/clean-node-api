import { type HttpRequest, type Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

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
      answers: [
        {
          image: 'any_image_1',
          answer: 'any_answer_1'
        },
        {
          image: 'any_image_2',
          answer: 'any_answer_2'
        }
      ]
    }
  }
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
