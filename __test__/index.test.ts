import { TimeoutError } from "p-timeout"
import delay from "delay"

import { test, HttpHandlerToWrap } from "../src"

const delayHandler: HttpHandlerToWrap = async () => {
  await delay(300)
  return {
    data: 123
  }
}

it("should return text", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    ctx.body = "123"
  })({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe("123")
  expect(headers).toHaveProperty("Content-Type", "text/plain")
})

it("should return text with get", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    ctx.body = "123"
  })()
  expect(status).toBe(200)
  expect(body).toBe("123")
  expect(headers).toHaveProperty("Content-Type", "text/plain")
})

it("should return html", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    ctx.body = "<html><h1>hello world</h1></html>"
  })({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe("<html><h1>hello world</h1></html>")
  expect(headers).toHaveProperty("Content-Type", "text/html")
})

it("should return json", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    ctx.body = { a: 1 }
  })({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe(JSON.stringify({ a: 1 }))
  expect(headers).toHaveProperty("Content-Type", "application/json")
})

it("should return file", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    ctx.body = new Buffer("hello world")
  })({
    method: "POST"
  })
  expect(status).toBe(200)
  expect(body).toBe(new Buffer("hello world").toString("base64"))
  expect(headers).toHaveProperty("Content-Type", "application/octet-stream")
})

it("should return error", async () => {
  const { status, body, headers } = await test(async (ctx) => {
    throw new Error("not found")
  })({
    method: "POST"
  })
  expect(status).toBe(500)
  expect(body).toBe(undefined)
  expect(headers).toHaveProperty("Content-Type", undefined)
})

it("should return error with custom statusCode", async () => {
  const { status, body, headers } = await test(
    async (ctx) => {
      ctx.status = 404
      throw new Error("not found")
    },
    {
      onError: (e, ctx) => {
        ctx.body = { message: e.message }
      }
    }
  )({
    method: "POST"
  })
  expect(status).toBe(404)
  expect(body).toBe(JSON.stringify({ message: "not found" }))
  expect(headers).toHaveProperty("Content-Type", "application/json")
})

it("should throw timeout error", async () => {
  await expect(test(delayHandler, { timeout: 300 })()).rejects.toBeInstanceOf(
    TimeoutError
  )
})
