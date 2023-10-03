export interface AddSurveyModel {
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image?: string
  text: string
}

export interface AddSurvey {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
