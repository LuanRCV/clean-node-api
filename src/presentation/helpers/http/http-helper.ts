import { ServerError, UnauthorizedError } from '../../errors'
import { type HttpResponse } from '../../protocols/http'

export class HttpHelper {
  static badRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: error
    }
  }

  static forbidden (error: Error): HttpResponse {
    return {
      statusCode: 403,
      body: error
    }
  }

  static unauthorized (): HttpResponse {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static serverError (error: Error): HttpResponse {
    return {
      statusCode: 500,
      body: new ServerError(error.stack)
    }
  }

  static ok (data: any): HttpResponse {
    return {
      statusCode: 200,
      body: data
    }
  }
}
