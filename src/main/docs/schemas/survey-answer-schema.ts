export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string'
    },
    image: {
      type: 'string'
    }
  },
  required: ['text']
}
