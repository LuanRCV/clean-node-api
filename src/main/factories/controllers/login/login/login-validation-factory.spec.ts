import { type Validation } from '@presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@validation/validators'
import { makeLoginValidation } from './login-validation-factory'
import { mockEmailValidator } from '@validation/test'

jest.mock('@validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
