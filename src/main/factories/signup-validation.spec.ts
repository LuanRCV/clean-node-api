import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const requiredFieldsValidation = requiredFields.map(field => new RequiredFieldValidation(field))

    const compareFields = [
      {
        fieldName: 'password',
        fieldToCompareName: 'passwordConfirmation'
      }
    ]
    const compareFielsValidation = compareFields.map(item => new CompareFieldsValidation(item.fieldName, item.fieldToCompareName))

    expect(ValidationComposite).toHaveBeenCalledWith([
      ...requiredFieldsValidation,
      ...compareFielsValidation
    ])
  })
})
