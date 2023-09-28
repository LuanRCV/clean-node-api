import { HttpHelper } from '../../../helpers/http/http-helper'
import { type Validation, type Controller, type HttpRequest, type HttpResponse } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body)

    if (validationError) {
      return HttpHelper.badRequest(validationError)
    }

    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {}
      })
    })
  }
}
