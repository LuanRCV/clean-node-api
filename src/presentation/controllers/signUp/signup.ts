import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse, type AddAccount, type Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { HttpHelper } from '../../helpers/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return HttpHelper.badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return HttpHelper.ok(account)
    } catch (error) {
      console.error(error)
      return HttpHelper.serverError(error)
    }
  }
}
