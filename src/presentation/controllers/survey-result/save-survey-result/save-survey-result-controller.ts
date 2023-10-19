import {
  type HttpRequest,
  type Controller,
  type HttpResponse,
  type Validation,
  type LoadSurveyById,
  type SaveSurveyResult
} from './save-survey-result-protocols'
import { HttpHelper } from '../../../helpers/http/http-helper'
import { InvalidParamError, SurveyNotFoundError } from '../../../errors'

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
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.load(surveyId)

      if (survey) {
        const answers = survey.answers.map(answer => answer.text)
        if (answers.includes(answer)) {
          const surveyResult = await this.saveSurveyResult.save(httpRequest.body)

          return HttpHelper.ok(surveyResult)
        } else {
          return HttpHelper.forbidden(new InvalidParamError('answer'))
        }
      } else {
        return HttpHelper.forbidden(new SurveyNotFoundError())
      }
    } catch (error) {
      return HttpHelper.serverError(error)
    }
  }
}
