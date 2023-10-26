import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const buildSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

const mockInput = (): any => {
  return {
    any_field: 'any_value'
  }
}

describe('RequiredField Validation', () => {
  describe('Method validate', () => {
    test('Should return a MissingParamError if validation fails', () => {
      const sut = buildSut()
      const validationError = sut.validate({})

      expect(validationError).toEqual(new MissingParamError('any_field'))
    })

    test('Should return null if validation succeeds', () => {
      const sut = buildSut()
      const validationError = sut.validate(mockInput())

      expect(validationError).toBeNull()
    })
  })
})
