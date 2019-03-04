import MockReq from "mock-req"

const AUTO_END_METHOD = ["GET", "HEAD", "DELETE"]

export const couldHaveBody = (method: string): boolean =>
  AUTO_END_METHOD.indexOf(method) < 0

export interface ITestReq {
  method?: string
  query?: { [key: string]: any }
  body?: any
  headers?: { [key: string]: string }
}

export const mockRequest = (req?: ITestReq) => {
  req = req || {}
  const method = req.method || "GET"
  const body = req.body || {}
  const haveBody = couldHaveBody(method)
  const request = new MockReq({
    method,
    url: "/",
    headers: {
      ...(haveBody && {
        "Content-type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(body), "utf8")
      }),
      ...req.headers
    }
  })

  if (haveBody) {
    request.write(body)
    request.end()
  }

  return Object.assign(request, {
    queries: new Map(Object.entries(req.query || {})),
    clientIp: "127.0.0.1",
    path: "/"
  })
}

export const mockResponse = () => {
  return {
    setStatusCode: (statusCode: number) => {},
    setHeader: (headerKey: string, headerValue: string) => {},
    deleteHeader: (headerKey: string) => {},
    send: (body: Buffer | string | ReadableStream) => {}
  }
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
