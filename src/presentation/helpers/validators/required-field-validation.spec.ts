import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

const makeFakeInput = (): any => {
  return {
    any_field: 'any_value'
  }
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({})

    expect(validationError).toEqual(new MissingParamError('any_field'))
  })

  test('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const validationError = sut.validate(makeFakeInput())

    expect(validationError).toBeFalsy()
  })
})
