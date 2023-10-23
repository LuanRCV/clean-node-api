export class SurveyNotFoundError extends Error {
  constructor () {
    super('The survey provided was not found')
    this.name = 'SurveyNotFoundError'
  }
}
