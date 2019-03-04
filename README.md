# Aliyun-serverless-wrapper

## This lib only works when using [http-trigger](https://help.aliyun.com/document_detail/74757.html?spm=a2c4g.11186623.6.558.1d555ed64YgYv8#HTTP-trigger-interface)

## Yet this lib doesn't support multipart form data

By using this wrapper you shall write your handler function in a koa-like way.

## API

`wrapper(handler: (ctx: WrappedContext, options?: WrapperOptions) => void) => void`

The original `request`, `response`, `context` object will be merged into a more powerful `WrappedContext` object and passed into handler function.

#### IWrapperOptions

- `timeout:` set a timeout (ms) to limit the time range running handler

- `onError:` you can set a callback like `(err:Error, ctx: WrappedContext) => void` for this field and do some error handler

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
