import { loginPath, signupPath, surveyPath } from './paths'
import { accessTokenSchema, credentialSchema, errorSchema, loginParamsSchema, signupParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'
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
    },
    {
      name: 'Survey Result'
    }
  ],
  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/surveys': surveyPath
  },
  schemas: {
    loginParams: loginParamsSchema,
    signupParams: signupParamsSchema,
    credential: credentialSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
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
