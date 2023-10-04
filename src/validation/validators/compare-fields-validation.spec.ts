import { InvalidParamError } from '@presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'any_field_to_compare')
}

const makeFakeInput = (): any => {
  return {
    any_field: 'any_value',
    any_field_to_compare: 'any_value'
  }
}

describe('CompareFields Validation', () => {
  describe('Method validate', () => {
    test('Should return an InvalidParamError if validation fails', () => {
      const sut = makeSut()
      const validationError = sut.validate({
        any_field: 'any_value',
        any_field_to_compare: 'any_other_value'
      })

      expect(validationError).toEqual(new InvalidParamError('any_field_to_compare'))
    })

    test('Should return null on success', () => {
      const sut = makeSut()
      const validationError = sut.validate(makeFakeInput())

      expect(validationError).toBeNull()
    })
  })
})
