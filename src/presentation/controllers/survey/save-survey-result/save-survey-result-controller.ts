import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { type LoadSurveyById } from '@domain/usecases/load-survey-by-id'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { surveyId } = httpRequest.params
      await this.loadSurveyById.loadById(surveyId)

      return HttpHelper.noContent()
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
