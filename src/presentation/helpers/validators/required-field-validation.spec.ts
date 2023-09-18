import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('any_field')
  }

  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({})

    expect(validationError).toEqual(new MissingParamError('any_field'))
  })
})
