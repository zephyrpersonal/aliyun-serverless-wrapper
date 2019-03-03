import httpMocks from "node-mocks-http"
import { AliyunHttpRequest } from "../src/types"

export const mockRequest = (
  queries: null | { [key: string]: any },
  clientIp: null | string
) => {
  const request = httpMocks.createRequest({
    headers: {
      "content-type": "application/json",
      "content-length": JSON.stringify({ a: 1 }).length.toString()
    },
    method: "POST",
    url: "/",
    body: { a: 1 }
  })

  return Object.assign(request, {
    queries: new Map(Object.entries(queries || {})),
    clientIp: clientIp || "127.0.0.1"
  })
}

export const mockResponse = () => {
  return Object.assign(httpMocks.createResponse(), {
    setStatusCode: (statusCode: number) => {},
    setHeader: (headerKey: string, headerValue: string) => {},
    deleteHeader: (headerKey: string) => {},
    send: (body: Buffer | string | ReadableStream) => {}
  })
}

export const mockContext = () => {
  return {
    requestId: "b1c5100f-819d-c421-3a5e-7782a27d8a33",
    credentials: {
      accessKeyId: "STS.access_key_id",
      accessKeySecret: "access_key_secret",
      securityToken: "security_token"
    },
    function: {
      name: "my-func",
      handler: "index.handler",
      memory: 128,
      timeout: 10,
      initializer: "index.initializer",
      initializationTimeout: 10
    },
    service: {
      name: "my-service",
      logProject: "my-log-project",
      logStore: "my-log-store",
      qualifier: "qualifier",
      versionId: "1"
    },
    region: "cn-shanghai",
    accountId: "123456"
  }
}
