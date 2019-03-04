# Aliyun-serverless-wrapper

## This lib only works when using [http-trigger](https://help.aliyun.com/document_detail/74757.html?spm=a2c4g.11186623.6.558.1d555ed64YgYv8#HTTP-trigger-interface)

By using this wrapper you shall write your handler function in a koa-like way.

## API

`wrapper(handler: (ctx: IWrappedContext) => void) => void`

The original `request`, `response`, `context` object will be merged into a more powerful `IWrappedContext` object and passed into handler function.

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
```
