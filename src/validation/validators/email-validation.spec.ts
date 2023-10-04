import { InvalidParamError } from '@presentation/errors'
import { type EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeInput = (): any => {
  return {
    email: 'any_email@mail.com'
  }
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  describe('Method validate', () => {
    describe('EmailValidator integration', () => {
      test('Should call isValid with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate(makeFakeInput())

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return an error if isValid returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const validationResponse = sut.validate(makeFakeInput())

        expect(validationResponse).toEqual(new InvalidParamError('email'))
      })

      test('Should throw if isValid throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

        expect(sut.validate).toThrow()
      })
    })

    test('Should return null on success', () => {
      const { sut } = makeSut()
      const validationError = sut.validate(makeFakeInput())

      expect(validationError).toBeNull()
    })
  })
})
