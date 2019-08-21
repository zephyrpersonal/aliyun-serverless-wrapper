import { TimeoutError } from "p-timeout"
import delay from "delay"

import { test, wrapper } from "../src"

const wrappedMockDelay = wrapper(
  async () => {
    await delay(300)
    return {
      data: 123
    }
  },
  { timeout: 300 }
)

const wrappedString = wrapper(async (ctx) => {
  ctx.body = "123"
})

const wrappedHtml = wrapper(async (ctx) => {
  ctx.body = "<html><h1>hello world</h1></html>"
})
const wrappedJSON = wrapper(async (ctx) => {
  ctx.body = { a: 1 }
})

const wrappedError2 = wrapper(
  async (ctx) => {
    ctx.status = 404
    throw new Error("not found")
  },
  {
    onError: (e, ctx) => {
      ctx.body = { message: e.message }
    }
  }
)

const wrappedError = wrapper(async () => {
  throw new Error("not found")
})

const wrappedDirect = wrapper(async (ctx) => {
  ctx.redirect("https://baidu.com")
})

it("should return text", async () => {
  const { status, body, headers } = await test(wrappedString)({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe("123")
  expect(headers).toHaveProperty("Content-Type", "text/plain")
})

it("should return text with get", async () => {
  const { status, body, headers } = await test(wrappedString)()
  expect(status).toBe(200)
  expect(body).toBe("123")
  expect(headers).toHaveProperty("Content-Type", "text/plain")
})

it("should return html", async () => {
  const { status, body, headers } = await test(wrappedHtml)({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe("<html><h1>hello world</h1></html>")
  expect(headers).toHaveProperty("Content-Type", "text/html")
})

it("should return json", async () => {
  const { status, body, headers } = await test(wrappedJSON)({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe(JSON.stringify({ a: 1 }))
  expect(headers).toHaveProperty("Content-Type", "application/json")
})

it("should return error", async () => {
  const { status, body, headers } = await test(wrappedError)({
    method: "POST"
  })
  expect(status).toBe(500)
  expect(body).toBe(JSON.stringify({ errMessage: "not found" }))
  expect(headers).toHaveProperty("Content-Type", "application/json")
})

it("should return error with custom statusCode", async () => {
  const { status, body, headers } = await test(wrappedError2)({
    method: "POST"
  })
  expect(status).toBe(404)
  expect(body).toBe(JSON.stringify({ message: "not found" }))
  expect(headers).toHaveProperty("Content-Type", "application/json")
})

it("should throw timeout error", async () => {
  await expect(test(wrappedMockDelay)()).rejects.toBeInstanceOf(TimeoutError)
})

it("should redirect to baidu", async () => {
  const { status, headers } = await test(wrappedDirect)({
    method: "POST"
  })
  expect(status).toBe(301)
  expect(headers).toHaveProperty("Location", "https://baidu.com")
})
