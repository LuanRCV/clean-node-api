import { type SurveyAnswer } from '../models/survey'

export type AddSurveyModel = {
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
