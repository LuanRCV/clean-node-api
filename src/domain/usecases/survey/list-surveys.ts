import { type SurveyModel } from '../../models/survey'

export interface ListSurveys {
  list: () => Promise<SurveyModel[]>
}
