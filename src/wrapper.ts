import pTimeout from "p-timeout"
import { AliyunHttpHandlerFunctionWrapper } from "./types"
import { createContext } from "./context"

export const wrapper: AliyunHttpHandlerFunctionWrapper = (handler, options) => {
  options = options || {
    timeout: null
  }
  return async (request, response, context) => {
    const run = async () => {
      const ctx = await createContext(request, response, context)
      const functionResult = await handler(ctx)
      console.log(ctx.res.status, ctx.res.body, ctx.res.header)
      return functionResult
    }
    return options.timeout ? pTimeout(run(), options.timeout) : run()
  }
}
