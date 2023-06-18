import { MissingParamError } from '../errors/MissingParamError'
import { HttpHelper } from '../helpers/HttpHelper'
import { type HttpResponse, type HttpRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return HttpHelper.badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return HttpHelper.badRequest(new MissingParamError('email'))
    }

    return {
      statusCode: 200,
      body: {
        message: 'Signed up'
      }
    }
  }
}
