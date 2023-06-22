import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { HttpHelper } from '../helpers/http'

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

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return HttpHelper.badRequest(new InvalidParamError('passwordConfirmation'))
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
