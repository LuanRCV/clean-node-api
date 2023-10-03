import { type ListSurveys, type HttpRequest, type Controller, type HttpResponse } from './list-surveys-controller-protocols'

export class ListSurveysController implements Controller {
  constructor (
    private readonly listSurveys: ListSurveys
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.listSurveys.list()
    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {}
      })
    })
  }
}
