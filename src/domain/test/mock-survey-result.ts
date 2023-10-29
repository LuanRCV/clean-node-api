import { type SurveyResultModel } from '@domain/models/survey-result'
import { type SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image_url_1',
        text: 'any_text_1',
        count: 1,
        percent: 50
      },
      {
        text: 'any_text_2',
        count: 1,
        percent: 50
      }
    ],
    date: new Date()
  }
}
