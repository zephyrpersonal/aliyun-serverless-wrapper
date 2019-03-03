import { IncomingMessage, ServerResponse } from "http"

export interface AliyunHttpRequest extends IncomingMessage {
  headers: any
  path: string
  queries: Map<string, string | any[]>
  method: string
  clientIp: string
  url: string
}

export interface AliyunHttpResponse {
  setStatusCode: (statusCode: number) => void
  setHeader: (headerKey: string, headerValue: string) => void
  deleteHeader: (headerKey: string) => void
  send: (body: Buffer | string | ReadableStream) => void
}

export interface AliyunHttpContextCredentials {
  accessKeyId: string
  accessKeySecret: string
  securityToken: string
}

export interface AliyunHttpContextFunction {
  name: string
  handler: string
  memory: number
  timeout: number
  initializer?: string
  initializationTimeout?: number
}

export interface AliyunHttpContextService {
  name: string
  logProject?: string
  logStore?: string
  qualifier: string
  versionId: string
}

export interface AliyunHttpContext {
  requestId: string
  credentials: AliyunHttpContextCredentials
  function: AliyunHttpContextFunction
  service: AliyunHttpContextService
  region: string
  accountId: string
}

export interface IWrappedRequest extends AliyunHttpRequest {}
export interface IWrappedResponse extends AliyunHttpResponse {}

export interface IWrappedContext extends AliyunHttpContext {
  req: IWrappedRequest
  res: IWrappedResponse
  body: null | { [key: string]: any }
  status: number
}

export type CreateContextFunction = (
  req: AliyunHttpRequest,
  res: AliyunHttpResponse,
  ctx: AliyunHttpContext
) => IWrappedContext | Promise<IWrappedContext>

export type AliyunHttpHandlerFunction = (
  req: AliyunHttpRequest,
  res: AliyunHttpResponse,
  ctx: AliyunHttpContext
) => Promise<any> | any

export interface IWrappedHttpHandlerReturnValue {
  data: any
}

export type HttpHandlerToWrap = (
  ctx: IWrappedContext
) => IWrappedHttpHandlerReturnValue | Promise<IWrappedHttpHandlerReturnValue>

export interface AliyunHttpHandlerFunctionWrapperOptions {
  timeout: number
}

export type AliyunHttpHandlerFunctionWrapper = (
  handler: HttpHandlerToWrap,
  options?: AliyunHttpHandlerFunctionWrapperOptions
) => AliyunHttpHandlerFunction
