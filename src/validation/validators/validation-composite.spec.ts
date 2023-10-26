import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { type Validation } from '@presentation/protocols'
import { ValidationComposite } from './validation-composite'
import { mockValidation } from '@presentation/test'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const buildSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  describe('Method validate', () => {
    test('Should return an error if any validation fails', () => {
      const { sut, validationStubs } = buildSut()
      jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
      const validationError = sut.validate({ any_field: 'any_value' })

      expect(validationError).toEqual(new MissingParamError('any_field'))
    })

    test('Should return the first error if more then one validation fails', () => {
      const { sut, validationStubs } = buildSut()
      jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('any_field'))
      jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
      const validationError = sut.validate({})

      expect(validationError).toEqual(new InvalidParamError('any_field'))
    })

    test('Should return null if all validations succeeds', () => {
      const { sut } = buildSut()
      const validationError = sut.validate({})

      expect(validationError).toBeNull()
    })
  })
})
