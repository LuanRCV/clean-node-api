import {
  type Validation,
  type HttpRequest,
  type LoadSurveyById,
  type SaveSurveyResult
} from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { InvalidParamError, MissingParamError, ServerError, SurveyNotFoundError } from '../../../errors'
import { HttpHelper } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockSurveyResultModel, throwError } from '@domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult, mockValidation } from '@presentation/test'

const mockRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_survey_id'
    },
    body: {
      answer: 'any_text_1'
    },
    accountId: 'any_account_id'
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  validationStub: Validation
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const buildSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(validationStub, loadSurveyByIdStub, saveSurveyResultStub)

  return {
    sut,
    validationStub,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set('1996-06-07')
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = buildSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fail', async () => {
    const { sut, validationStub } = buildSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('any_field')))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = buildSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdStub } = buildSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = buildSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.forbidden(new SurveyNotFoundError()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = buildSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      },
      accountId: 'any_account_id'
    })

    expect(httpResponse).toEqual(HttpHelper.forbidden(new InvalidParamError('answer')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = buildSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = buildSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_text_1',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = buildSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = buildSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(HttpHelper.ok(mockSurveyResultModel()))
  })
})
