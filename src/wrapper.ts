import pTimeout from "p-timeout"
import {
  AliyunHttpHandlerFunctionWrapper,
  AliyunHttpHandlerFunction,
  HttpHandlerToWrap
} from "./types"
import { createContext } from "./context"

export const wrapper: AliyunHttpHandlerFunctionWrapper = (handler, options) => {
  options = options || {}
  const onError =
    options.onError ||
    ((e, ctx) => {
      ctx.body = { errMessage: e.message }
    })
  const wrappedHandler: AliyunHttpHandlerFunction & {
    __raw__: HttpHandlerToWrap
  } = async (request, response, context) => {
    const run = async () => {
      const ctx = await createContext(request, response, context)
      try {
        await handler(ctx)
        ctx.status = ctx.status || 200
      } catch (e) {
        ctx.status = ctx.status >= 400 ? ctx.status : 500
        onError(e, ctx)
      } finally {
        ctx.finish()
      }
      return ctx
    }
    return options.timeout ? pTimeout(run(), options.timeout) : run()
  }

  wrappedHandler.__raw__ = handler
  return wrappedHandler
}
