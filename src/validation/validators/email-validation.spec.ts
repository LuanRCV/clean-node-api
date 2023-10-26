import { InvalidParamError } from '@presentation/errors'
import { type EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'
import { mockEmailValidator } from '@validation/test'

const mockInput = (): any => {
  return {
    email: 'any_email@mail.com'
  }
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const buildSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
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
        const { sut, emailValidatorStub } = buildSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate(mockInput())

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return an error if isValid returns false', () => {
        const { sut, emailValidatorStub } = buildSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const validationResponse = sut.validate(mockInput())

        expect(validationResponse).toEqual(new InvalidParamError('email'))
      })

      test('Should throw if isValid throws', () => {
        const { sut, emailValidatorStub } = buildSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

        expect(sut.validate).toThrow()
      })
    })

    test('Should return null on success', () => {
      const { sut } = buildSut()
      const validationError = sut.validate(mockInput())

      expect(validationError).toBeNull()
    })
  })
})
