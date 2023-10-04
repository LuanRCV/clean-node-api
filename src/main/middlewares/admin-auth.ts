import { adaptMiddleware } from '../adapters/express-middleware-adapter.ts'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory.js'

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
