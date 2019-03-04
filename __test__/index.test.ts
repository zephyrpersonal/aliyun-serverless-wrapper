import { TimeoutError } from "p-timeout"
import delay from "delay"

import { test, HttpHandlerToWrap } from "../src"

const handler: HttpHandlerToWrap = async () => ({ data: 123 })

const passContextHandler: HttpHandlerToWrap = async (ctx) => ({
  data: ctx.body
})

const delayHandler: HttpHandlerToWrap = async () => {
  await delay(1000)
  return {
    data: 123
  }
}

it("should return object", async () => {
  await expect(
    test(handler)({
      method: "POST"
    })
  ).resolves.toEqual({
    data: 123
  })
})

it("should return ctx.body", async () => {
  await expect(
    test(passContextHandler)({
      method: "POST",
      body: { a: 1 }
    })
  ).resolves.toEqual({
    data: JSON.stringify({ a: 1 })
  })
})

it("should throw timeout error", async () => {
  await expect(test(delayHandler, { timeout: 1000 })()).rejects.toBeInstanceOf(
    TimeoutError
  )
})
