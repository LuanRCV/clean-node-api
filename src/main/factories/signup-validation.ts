import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { type Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const requiredFieldsValidation = requiredFields.map(field => new RequiredFieldValidation(field))

  return new ValidationComposite([...requiredFieldsValidation])
}
