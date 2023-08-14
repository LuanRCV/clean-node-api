import { type Controller, type HttpRequest, type HttpResponse } from './login-protocols'
import { HttpHelper } from '../../helpers/http'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return HttpHelper.badRequest(new MissingParamError(field))
      }
    }

    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {}
      })
    })
  }
}
