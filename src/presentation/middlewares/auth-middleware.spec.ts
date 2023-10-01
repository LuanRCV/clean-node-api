import { AuthMiddleware } from './auth-middleware'
import { HttpHelper } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return {
    sut
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token header is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(HttpHelper.forbidden(new AccessDeniedError()))
  })
})
