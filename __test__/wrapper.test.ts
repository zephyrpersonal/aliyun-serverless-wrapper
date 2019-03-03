import { TimeoutError } from "p-timeout"
import delay from "delay"

import { wrapper } from "../src/wrapper"
import { HttpHandlerToWrap } from "../src/types"
import { mockRequest, mockResponse, mockContext } from "./helper"

const handler: HttpHandlerToWrap = async (ctx) => {
  return {
    data: 123
  }
}

const delayHandler: HttpHandlerToWrap = async (ctx) => {
  await delay(3000)
  return {
    data: 123
  }
}

it("should return object", async () => {
  await expect(
    wrapper(handler)(mockRequest({}, null), mockResponse(), mockContext())
  ).resolves.toEqual({
    data: 123
  })
})

it("should throw timeout error", async () => {
  await expect(
    wrapper(delayHandler, { timeout: 3000 })(
      mockRequest({}, null),
      mockResponse(),
      mockContext()
    )
  ).rejects.toBeInstanceOf(TimeoutError)
})
