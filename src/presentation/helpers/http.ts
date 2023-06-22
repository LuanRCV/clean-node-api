import { ServerError } from '../errors/server'
import { type HttpResponse } from '../protocols/http'

export class HttpHelper {
  static badRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError (): HttpResponse {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }
}
