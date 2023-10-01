import { AccessDeniedError } from '../errors'
import { HttpHelper } from '../helpers/http/http-helper'
import { type Middleware, type HttpRequest, type HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return HttpHelper.forbidden(new AccessDeniedError())
  }
}
