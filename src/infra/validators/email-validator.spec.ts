import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (text: string): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  describe('Method isValid', () => {
    describe('validator integration', () => {
      test('Should call isEmail with correct email', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@mail.com')

        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
      })

      test('Should return false if isEmail returns false', () => {
        const sut = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@mail.com')

        expect(isValid).toBe(false)
      })
    })

    test('Should return true on success', () => {
      const sut = makeSut()
      jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
      const isValid = sut.isValid('valid_email@mail.com')

      expect(isValid).toBe(true)
    })
  })
})
