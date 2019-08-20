import parser from "co-body"
import { Response } from "./response"

import { CreateContextFunction, AliyunHttpContext } from "./types"
import { couldHaveBody } from "./helper"
import { Request } from "./request"

export class Context {
  public constructor(
    public request: Request,
    public response: Response,
    private readonly originalCtx: AliyunHttpContext
  ) {}

  public get req() {
    return this.request
  }

  public get res() {
    return this.response
  }

  public get credentials() {
    return this.originalCtx.credentials
  }

  public get service() {
    return this.originalCtx.service
  }

  public get query() {
    return this.request.query
  }

  public get ip() {
    return this.request.ip
  }

  public get method() {
    return this.request.method
  }

  public get requestId() {
    return this.originalCtx.requestId
  }

  public get accountId() {
    return this.originalCtx.accountId
  }

  public get function() {
    return this.originalCtx.function
  }

  public get region() {
    return this.originalCtx.region
  }

  public setHeader(field: string, value: string) {
    this.response.setHeader(field, value)
  }

  public removeHeader(field: string) {
    this.response.removeHeader(field)
  }

  public get header() {
    return this.response.header
  }

  public get headers() {
    return this.header
  }

  public get status() {
    return this.response.status
  }

  public set status(code: number) {
    this.response.status = code
  }

  public set body(value: any) {
    this.response.body = value
  }

  public get body() {
    return this.response.body
  }

  public finish() {
    return this.response.finish()
  }

  public redirect(newUrl: string) {
    this.status = 301
    this.setHeader("Location", newUrl)
  }
}

export const createContext: CreateContextFunction = async (req, res, ctx) => {
  const response = new Response(res)
  const request = new Request(req)
  const context = new Context(request, response, ctx)
  try {
    if (couldHaveBody(req.method)) {
      context.request.body = await parser(req)
    }
  } catch (e) {
    console.error(e)
  }
  return context
}
