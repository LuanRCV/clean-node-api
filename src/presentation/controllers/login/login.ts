import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse, type Authentication } from './login-protocols'
import { HttpHelper } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return HttpHelper.badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return HttpHelper.unauthorized()
      }

      return await new Promise(resolve => {
        resolve({
          statusCode: 200,
          body: {}
        })
      })
    } catch (error) {
      console.error(error)
      return HttpHelper.serverError(error)
    }
  }
}
