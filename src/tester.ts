import {
  HttpHandlerToWrap,
  AliyunHttpHandlerFunctionWrapperOptions
} from "./types"
import { wrapper } from "./wrapper"
import { mockRequest, mockResponse, mockContext, ITestReq } from "./helper"

export const test = (
  handler: HttpHandlerToWrap,
  options?: AliyunHttpHandlerFunctionWrapperOptions
) => async (args?: ITestReq) => {
  const wrapped = wrapper(handler, options)
  return wrapped(mockRequest(args), mockResponse(), mockContext())
}
