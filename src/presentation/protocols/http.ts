export type HttpRequest = {
  params?: any
  body?: any
  headers?: any
  accountId?: string
}

export type HttpResponse = {
  statusCode: number
  body: any
}
