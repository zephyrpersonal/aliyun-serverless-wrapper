import httpMocks from "node-mocks-http"
import MockReq from "mock-req"

const AUTO_END_METHOD = ["GET", "HEAD", "DELETE"]

export interface ITestReq {
  method?: string
  query?: { [key: string]: any }
  body?: any
  headers?: { [key: string]: string }
}

export const mockRequest = (req?: ITestReq) => {
  req = req || {}
  const method = req.method || "GET"
  const couldHaveBody = AUTO_END_METHOD.indexOf(method) < 0
  const request = new MockReq({
    method,
    url: "/stuff?q=thing",
    headers: {
      ...(couldHaveBody && {
        "Content-type": "application/json",
        "content-length": Buffer.byteLength(
          JSON.stringify(req.body),
          "utf8"
        )
      }),
      ...req.headers
    }
  })

  if (AUTO_END_METHOD.indexOf(method)) {
    request.write(req.body)
    request.end()
  }

  return Object.assign(request, {
    queries: new Map(Object.entries(req.query || {})),
    clientIp: "127.0.0.1",
    path: "/"
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
