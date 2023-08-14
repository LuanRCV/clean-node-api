import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from './login-protocols'
import { HttpHelper } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return HttpHelper.badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return HttpHelper.badRequest(new InvalidParamError('email'))
    }

    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {}
      })
    })
  }
}
