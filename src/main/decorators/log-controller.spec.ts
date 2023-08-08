import { type HttpRequest, type Controller, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller'

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return await new Promise((resolve) => {
          resolve({
            statusCode: 200,
            body: {
              name: 'any_name',
              email: 'any_mail@mail.com',
              password: 'any_password',
              passwordConfirmation: 'any_password'
            }
          })
        })
      }
    }

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
