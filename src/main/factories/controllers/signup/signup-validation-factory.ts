import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { type Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
