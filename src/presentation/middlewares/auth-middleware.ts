import { type LoadAccountByToken, type Middleware, type HttpRequest, type HttpResponse } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { HttpHelper } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)

        if (account) {
          return HttpHelper.ok({ accountId: account.id.toString() })
        }
      }

      return HttpHelper.forbidden(new AccessDeniedError())
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
