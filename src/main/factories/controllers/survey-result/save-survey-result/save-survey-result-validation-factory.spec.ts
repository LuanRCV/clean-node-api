import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory'
import { type Validation } from '@presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '@validation/validators'

jest.mock('@validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation()
    const validations: Validation[] = []
    const requiredFields = ['answer']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
