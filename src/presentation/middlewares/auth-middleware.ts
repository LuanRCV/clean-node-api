import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { HttpHelper } from '../helpers/http/http-helper'
import { type Middleware, type HttpRequest, type HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)

      return HttpHelper.ok({})
    }

    return HttpHelper.forbidden(new AccessDeniedError())
  }
}
