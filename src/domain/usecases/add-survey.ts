export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image?: string
  text: string
}

export interface AddSurvey {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
