import { wrapper } from "../../src"

export const helloworld = wrapper(
  async (ctx) => {
    ctx.body = "hello world"
  },
  { timeout: 1000 }
)

export const helloworldJSON = wrapper(
  async (ctx) => {
    ctx.body = { hello: "world" }
  },
  { timeout: 1000 }
)

export const throwError = wrapper(
  async () => {
    throw new Error("hello world")
  },
  { timeout: 1000 }
)
