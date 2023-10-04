import { HttpHelper } from '../../../helpers/http/http-helper'
import { type ListSurveys, type HttpRequest, type Controller, type HttpResponse } from './list-surveys-controller-protocols'

export class ListSurveysController implements Controller {
  constructor (
    private readonly listSurveys: ListSurveys
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.listSurveys.list()

      if (surveys.length > 0) {
        return HttpHelper.ok(surveys)
      }

      return HttpHelper.noContent()
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
