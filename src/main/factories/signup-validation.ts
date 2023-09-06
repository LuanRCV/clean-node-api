import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { type Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const requiredFieldsValidation = requiredFields.map(field => new RequiredFieldValidation(field))

  const compareFields = [
    {
      fieldName: 'password',
      fieldToCompareName: 'passwordConfirmation'
    }
  ]
  const compareFielsValidation = compareFields.map(item => new CompareFieldsValidation(item.fieldName, item.fieldToCompareName))

  return new ValidationComposite([
    ...requiredFieldsValidation,
    ...compareFielsValidation
  ])
}
