import { LoginController } from './login-controller'
import { MissingParamError, ServerError } from '../../../errors'
import { type HttpRequest, type Authentication, type Validation } from './login-controller-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { mockCredentialModel, throwError } from '@domain/test'
import { mockAuthentication, mockValidation } from '@presentation/test'

const mockRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const buildSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = buildSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.serverError(new ServerError()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = buildSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = buildSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => { resolve(null) }))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = buildSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.ok(mockCredentialModel()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = buildSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fail', async () => {
    const { sut, validationStub } = buildSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('any_field')))
  })
})
