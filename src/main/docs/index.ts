import { loginPath, signupPath, surveyPath, surveysResultPath } from './paths'
import { accessTokenSchema, addSurveyParamsSchema, credentialSchema, errorSchema, loginParamsSchema, saveSurveyResultParamsSchema, signupParamsSchema, surveyAnswerSchema, surveyResultSchema, surveySchema, surveysSchema } from './schemas'
import { badRequestComponent, forbiddenComponent, notFoundComponent, serverErrorComponent, unauthorizedComponent } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Surveys API',
    description: 'API to manage Surveys and Accounts',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/license/isc-license-txt/'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Survey'
    }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveysResultPath
  },
  schemas: {
    loginParams: loginParamsSchema,
    signupParams: signupParamsSchema,
    credential: credentialSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      accessToken: accessTokenSchema
    },
    badRequest: badRequestComponent,
    unauthorized: unauthorizedComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent
  }
}
