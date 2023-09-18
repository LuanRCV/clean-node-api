import { MissingParamError } from '../../errors'
import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  interface SutTypes {
    sut: ValidationComposite
    validationStub: ValidationStub
  }

  const makeSut = (): SutTypes => {
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([
      validationStub
    ])

    return {
      sut,
      validationStub
    }
  }

  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const validationError = sut.validate({ any_field: 'any_value' })

    expect(validationError).toEqual(new MissingParamError('any_field'))
  })
})
