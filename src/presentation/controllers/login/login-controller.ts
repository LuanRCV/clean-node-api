import { type Controller, type HttpRequest, type HttpResponse, type Authentication, type Validation } from './login-controller-protocols'
import { HttpHelper } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      if (!accessToken) {
        return HttpHelper.unauthorized()
      }

      return HttpHelper.ok(accessToken)
    } catch (error) {
      console.error(error)
      return HttpHelper.serverError(error)
    }
  }
}
