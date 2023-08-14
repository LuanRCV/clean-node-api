import { MissingParamError } from '../../errors'
import { HttpHelper } from '../../helpers/http'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('password')))
  })

  //   test('Should return 400 if an invalid email is provided', () => {
  //   })

  //   test('Should call EmailValidator with correct email', () => {
  //   })

  //   test('Should return 500 if EmailValidator throws', async () => {
  //   })

  //   test('Should return 500 if GetAccount throws', async () => {
  //   })

  //   test('Should call GetAccount with correct values', async () => {
  //   })

  //   test('Should return 200 if valid data is provided', async () => {
  //   })
})
