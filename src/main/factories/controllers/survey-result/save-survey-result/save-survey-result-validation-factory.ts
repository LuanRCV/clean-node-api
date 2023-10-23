import { type Validation } from '@presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '@validation/validators'

export const makeSaveSurveyResultValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['answer']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
