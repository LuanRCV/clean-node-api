import { type Controller, type HttpRequest, type HttpResponse, type Authentication, type Validation } from './login-protocols'
import { HttpHelper } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { email, password } = httpRequest.body

      const credential = await this.authentication.auth(email, password)

      if (!credential.accessToken) {
        return HttpHelper.unauthorized()
      }

      return HttpHelper.ok(credential)
    } catch (error) {
      console.error(error)
      return HttpHelper.serverError(error)
    }
  }
}
