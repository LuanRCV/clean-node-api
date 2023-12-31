import { AuthMiddleware } from './auth-middleware'
import { HttpHelper } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { type LoadAccountByToken, type HttpRequest } from './auth-middleware-protocols'
import { mockLoadAccountByToken } from '@presentation/test'

const mockRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_access_token'
    }
  }
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const buildSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  describe('Method handle', () => {
    test('Should return 403 if no x-access-token header is provided', async () => {
      const { sut } = buildSut()
      const httpResponse = await sut.handle({})

      expect(httpResponse).toEqual(HttpHelper.forbidden(new AccessDeniedError()))
    })

    describe('LoadAccountByToken integration', () => {
      test('Should call load with correct accessToken', async () => {
        const role = 'any_role'
        const { sut, loadAccountByTokenStub } = buildSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(mockRequest())

        expect(loadSpy).toHaveBeenCalledWith('any_access_token', role)
      })

      test('Should return 403 if load returns null', async () => {
        const { sut, loadAccountByTokenStub } = buildSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse).toEqual(HttpHelper.forbidden(new AccessDeniedError()))
      })

      test('Should return 500 if load throws', async () => {
        const { sut, loadAccountByTokenStub } = buildSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => { throw new Error() })
        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse).toEqual(HttpHelper.serverError(new Error()))
      })
    })

    test('Should return 200 on success', async () => {
      const { sut } = buildSut()
      const httpResponse = await sut.handle(mockRequest())

      expect(httpResponse).toEqual(HttpHelper.ok({
        accountId: 'any_id'
      }))
    })
  })
})
