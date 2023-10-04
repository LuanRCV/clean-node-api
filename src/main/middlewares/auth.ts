import { adaptMiddleware } from '../adapters/express-middleware-adapter.ts.js'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory.js'

export const auth = adaptMiddleware(makeAuthMiddleware())
