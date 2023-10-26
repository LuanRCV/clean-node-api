import { type SurveyModel } from '@domain/models/survey'
import { type AddSurveyParams } from '@domain/usecases/survey/add-survey'

export const mockAddSurveyParams = (): AddSurveyParams => {
  return {
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image_url_1',
        text: 'any_text_1'
      },
      {
        text: 'any_text_2'
      }
    ]
  }
}

export const mockSurveyModel = (): SurveyModel => {
  return Object.assign({}, mockAddSurveyParams(), { id: 'any_id' })
}
