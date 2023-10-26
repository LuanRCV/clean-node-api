import { type LogErrorRepository } from '@data/protocols/db/log/log-error-repository'
import { HttpHelper } from '@presentation/helpers/http/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '@presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { mockAccountModel } from '@domain/test'
import { mockLogErrorRepository } from '@data/test'

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => {
        resolve(HttpHelper.ok(mockAccountModel()))
      })
    }
  }

  return new ControllerStub()
}

const mockRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

const mockServerError = (): HttpResponse => {
  const mockedError = new Error()
  mockedError.stack = 'any_stack'

  return HttpHelper.serverError(mockedError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const buildSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = buildSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = buildSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.ok(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct error stack if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = buildSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(mockServerError()) }))
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
