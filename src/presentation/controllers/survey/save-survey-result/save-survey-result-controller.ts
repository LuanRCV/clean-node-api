import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { type LoadSurveyById } from '@domain/usecases/load-survey-by-id'
import { SurveyNotFoundError } from '../../../errors'
import { type SaveSurveyResult } from '@domain/usecases/save-survey-result'

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
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        await this.saveSurveyResult.save(httpRequest.body)
        return HttpHelper.noContent()
      }

      return HttpHelper.forbidden(new SurveyNotFoundError())
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
