import { type Validation, type HttpRequest } from './save-survey-result-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { MissingParamError, ServerError, SurveyNotFoundError } from '../../../errors'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { type SurveyModel } from '../list-surveys/list-surveys-controller-protocols'
import { type LoadSurveyById } from '@domain/usecases/load-survey-by-id'

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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await new Promise(resolve => { resolve(makeFakeSurvey()) })
    }
  }

  return new LoadSurveyByIdStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_survey_id'
    },
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
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(validationStub, loadSurveyByIdStub)

  return {
    sut,
    validationStub,
    loadSurveyByIdStub
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

  test('Should return 400 if Validation fail', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('any_field')))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const validateSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(HttpHelper.forbidden(new SurveyNotFoundError()))
  })
})
