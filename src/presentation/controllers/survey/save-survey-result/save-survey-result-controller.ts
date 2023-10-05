import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest)

    if (validationError) {
      return HttpHelper.badRequest(validationError)
    }

    return await new Promise(resolve => { resolve(HttpHelper.noContent()) })
  }
}
