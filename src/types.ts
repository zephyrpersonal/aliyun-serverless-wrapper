import { IncomingMessage } from "http"
import { Response } from "./response"
import { Context } from "./context"

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

export interface IWrappedContext extends AliyunHttpContext {
  req: AliyunHttpRequest
  res: Response
  body: any
  status: number
}

export type CreateContextFunction = (
  req: AliyunHttpRequest,
  res: AliyunHttpResponse,
  ctx: AliyunHttpContext
) => Context | Promise<Context>

export type AliyunHttpHandlerFunction = (
  req: AliyunHttpRequest,
  res: AliyunHttpResponse,
  ctx: AliyunHttpContext
) => Promise<Context> | Context

export interface IWrappedHttpHandlerReturnValue {
  data: any
}

export type HttpHandlerToWrap = (
  ctx: Context
) =>
  | IWrappedHttpHandlerReturnValue
  | Promise<IWrappedHttpHandlerReturnValue | void>
  | void

export interface AliyunHttpHandlerFunctionWrapperOptions {
  timeout?: number
  onError?: (e: Error, ctx: Context) => void
}

export type AliyunHttpHandlerFunctionWrapper = (
  handler: HttpHandlerToWrap,
  options?: AliyunHttpHandlerFunctionWrapperOptions
) => AliyunHttpHandlerFunction
