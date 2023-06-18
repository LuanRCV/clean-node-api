import { MissingParamError } from '../errors/MissingParamError'
import { HttpHelper } from '../helpers/HttpHelper'
import { type HttpResponse, type HttpRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return HttpHelper.badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: {
        message: 'Signed up'
      }
    }
  }
}
