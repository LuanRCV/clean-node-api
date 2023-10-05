import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      return HttpHelper.noContent()
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
