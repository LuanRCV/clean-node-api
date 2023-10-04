import { ListSurveysController } from '../../../../../presentation/controllers/survey/list-surveys/list-surveys-controller'
import { type Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbListSurveys } from '../../../usecases/survey/list-surveys/db-list-surveys-factory'

export const makeListSurveysController = (): Controller => {
  return makeLogControllerDecorator(new ListSurveysController(makeDbListSurveys()))
}
