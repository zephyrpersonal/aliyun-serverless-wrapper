import parser from "co-body"
import { Response } from "./response"

import { CreateContextFunction, AliyunHttpContext } from "./types"
import { couldHaveBody } from "./helper"
import { Request } from "./request"

export class Context {
  public constructor(
    public req: Request,
    public res: Response,
    private readonly originalCtx: AliyunHttpContext
  ) {}

  public get credentials() {
    return this.originalCtx.credentials
  }

  public get service() {
    return this.originalCtx.service
  }

  public get query() {
    return this.req.query
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
    this.res.setHeader(field, value)
  }

  public removeHeader(field: string) {
    this.res.removeHeader(field)
  }

  public get header() {
    return this.res.header
  }

  public get headers() {
    return this.header
  }

  public get status() {
    return this.res.status
  }

  public set status(code: number) {
    this.res.status = code
  }

  public set body(value: any) {
    this.res.body = value
  }

  public get body() {
    return this.res.body
  }

  public finish() {
    return this.res.finish()
  }
}

export const createContext: CreateContextFunction = async (req, res, ctx) => {
  const response = new Response(res)
  const request = new Request(req)
  const context = new Context(request, response, ctx)
  try {
    if (couldHaveBody(req.method)) {
      context.req.body = await parser(req)
    }
  } catch (e) {
    console.error(e)
  }
  return context
}
