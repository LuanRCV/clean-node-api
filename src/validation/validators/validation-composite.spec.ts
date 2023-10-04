import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { type Validation } from '@presentation/protocols'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  describe('Method validate', () => {
    test('Should return an error if any validation fails', () => {
      const { sut, validationStubs } = makeSut()
      jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
      const validationError = sut.validate({ any_field: 'any_value' })

      expect(validationError).toEqual(new MissingParamError('any_field'))
    })

    test('Should return the first error if more then one validation fails', () => {
      const { sut, validationStubs } = makeSut()
      jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('any_field'))
      jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
      const validationError = sut.validate({})

      expect(validationError).toEqual(new InvalidParamError('any_field'))
    })

    test('Should return null if all validations succeeds', () => {
      const { sut } = makeSut()
      const validationError = sut.validate({})

      expect(validationError).toBeNull()
    })
  })
})
