export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string'
    },
    image: {
      type: 'string'
    },
    count: {
      type: 'number'
    },
    percent: {
      type: 'number'
    }
  },
  required: ['text', 'count', 'percent']
}
