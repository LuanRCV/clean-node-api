import { type Controller, type HttpRequest, type HttpResponse, type AddAccount, type Validation, type Authentication } from './signup-controller-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return HttpHelper.forbidden(new EmailInUseError())
      }

      const credential = await this.authentication.auth({
        email,
        password
      })

      return HttpHelper.ok(credential)
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
