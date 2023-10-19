import { type SaveSurveyResultModel, type SurveyResultModel, type SaveSurveyResultRepository } from '@data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (saveSurveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId, answer, date } = saveSurveyResultData
    const result = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId,
        accountId
      },
      {
        $set: {
          answer,
          date
        }
      },
      {
        upsert: true,
        returnOriginal: false
      }
    )

    return MongoHelper.mapEntity<SurveyResultModel>(result.value)
  }
}
