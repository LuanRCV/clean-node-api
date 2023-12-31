import { EmailValidatorAdapter } from '@infra/validators/email-validator-adapter'
import { type Validation } from '@presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
