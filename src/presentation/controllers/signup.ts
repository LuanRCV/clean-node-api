import { InvalidParamError } from '../errors/invalidParam'
import { MissingParamError } from '../errors/missingParam'
import { HttpHelper } from '../helpers/http'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/emailValidator'
import { type HttpResponse, type HttpRequest } from '../protocols/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return HttpHelper.badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200,
        body: {
          message: 'Signed up'
        }
      }
    } catch (error) {
      return HttpHelper.serverError()
    }
  }
}
