import { AliyunHttpHandlerFunction } from "./types"
import { mockRequest, mockResponse, mockContext, ITestReq } from "./helper"

export const test = (wrappedHandler: AliyunHttpHandlerFunction) => async (
  args?: ITestReq
) => {
  return wrappedHandler(mockRequest(args), mockResponse(), mockContext())
}
