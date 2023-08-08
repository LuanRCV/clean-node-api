import { type HttpRequest, type HttpResponse, type Controller } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest)

    return await new Promise((resolve) => {
      resolve({
        statusCode: 200,
        body: {}
      })
    })
  }
}
