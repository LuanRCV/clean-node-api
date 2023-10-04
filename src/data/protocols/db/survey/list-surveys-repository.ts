import { type SurveyModel } from '@domain/models/survey'

export interface ListSurveysRepository {
  list: () => Promise<SurveyModel[]>
}
