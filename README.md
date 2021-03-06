# Aliyun-serverless-wrapper

![npm](https://img.shields.io/npm/v/aliyun-serverless-wrapper.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b283383048264aca84abcaa8e02e01ac)](https://app.codacy.com/app/zephyrpersonal/aliyun-serverless-wrapper?utm_source=github.com&utm_medium=referral&utm_content=zephyrpersonal/aliyun-serverless-wrapper&utm_campaign=Badge_Grade_Dashboard)
[![CircleCI](https://circleci.com/gh/zephyrpersonal/aliyun-serverless-wrapper/tree/master.svg?style=svg)](https://circleci.com/gh/zephyrpersonal/aliyun-serverless-wrapper/tree/master)

## This lib only works when using [http-trigger](https://help.aliyun.com/document_detail/74757.html?spm=a2c4g.11186623.6.558.1d555ed64YgYv8#HTTP-trigger-interface)

## Yet this lib doesn't support multipart form data

By using this wrapper you shall write your handler function in a koa-like way.

Typescript friendly.

## API

`wrapper(handler: (ctx: WrappedContext, options?: WrapperOptions) => void) => void`

The original `request`, `response`, `context` object will be merged into a more powerful `WrappedContext` object and passed into handler function.

### WrapperOptions

- `timeout:` set a timeout (ms) to limit the time range running handler

- `onError:` you can set a callback like `(err:Error, ctx: WrappedContext) => void` for this field and do some error handler

### WrappedContext

- `req: Request` Request object

- `res: Response` Response object

  also fields inherit from aliyun runtime context

- `credentials: AliyunContextCredentials`

- `service: AliyunContextService`

- `requestId: string`

- `accountId: string`

- `function: AliyunContextFunction`

- `region: string`

  and short hands for ctx.res

- `setHeader(field: string, value: string): void`

- `removeHeader(field: string): void`

- `get header: Headers`

- `get headers: Headers`

- `get status: number`

- `set status(code: number): void`

- `get body: any`

- `set body(value: any): void`

### WrappedContext.Request

see [request.ts](src/request.ts)

### WrappedContext.Response

see [response.ts](src/response.ts)

## Example

Simply set the context's body, it will automatically send the response with proper status and header

```js
const { wrapper } = require("aliyun-serverless-wrapper")

exports.someFunction = wrapper(async (ctx) => {
  ctx.body = { hello: "world" }
})

/* response shall be

  HTTP/1.1 200 OK
  Content-Type: application/json

  { "hello": "world" }

*/

exports.someFunction = wrapper(async (ctx) => {
  ctx.body = "hello world"
})

/* response shall be

  HTTP/1.1 200 OK
  Content-Type: text/plain

  "hello world"

*/

exports.someFunction = wrapper(async (ctx) => {
  ctx.body = "<html><h1>hello wordl</h1></html>"
})

/* response shall be

  HTTP/1.1 200 OK
  Content-Type: text/html

  "<html><h1>hello wordl</h1></html>"

*/
```

Or throw Error

```js
exports.someFunction = wrapper(async (ctx) => {
  throw new Error("oops")
})

/* response shall be

  HTTP/1.1 500 Internal Error

*/

exports.someFunction = wrapper(
  async (ctx) => {
    await checkAuth(ctx.req) // and this will throw a Error
  },
  {
    onError: (e, ctx) => {
      ctx.status = 401
      ctx.body = { errorMessage: e.message }
    }
  }
)

/* response shall be

  HTTP/1.1 404 Not Found
  Content-Type: application/json

  { "errorMessage": "Not Authorized" }

*/
```
