import {
  type HttpRequest,
  type Controller,
  type HttpResponse,
  type Validation,
  type LoadSurveyById,
  type SaveSurveyResult
} from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { SurveyNotFoundError } from '../../../errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.load(surveyId)

      if (survey) {
        const surveyResult = await this.saveSurveyResult.save(httpRequest.body)

        return HttpHelper.ok(surveyResult)
      }

      return HttpHelper.forbidden(new SurveyNotFoundError())
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
