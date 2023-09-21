import { type Controller, type HttpRequest, type HttpResponse, type AddAccount, type Validation } from './signup-controller-protocols'
import { HttpHelper } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      return HttpHelper.ok(account)
    } catch (error) {
      console.error(error)
      return HttpHelper.serverError(error)
    }
  }
}
