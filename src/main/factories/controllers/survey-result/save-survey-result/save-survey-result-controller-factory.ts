import { type Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { makeDbLoadSurveyById } from '@main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '@main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory'

export const makeSaveSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new SaveSurveyResultController(makeSaveSurveyResultValidation(), makeDbLoadSurveyById(), makeDbSaveSurveyResult()))
}
