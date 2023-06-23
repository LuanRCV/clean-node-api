import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse, type AddAccount } from './signupProtocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { HttpHelper } from '../../helpers/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return HttpHelper.badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return HttpHelper.badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({ name, email, password })

      return HttpHelper.ok(account)
    } catch (error) {
      return HttpHelper.serverError()
    }
  }
}
