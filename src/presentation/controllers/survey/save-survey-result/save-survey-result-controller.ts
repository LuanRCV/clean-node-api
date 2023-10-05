import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest)
    return await new Promise(resolve => { resolve(HttpHelper.noContent()) })
  }
}
