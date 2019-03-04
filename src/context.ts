import parser from "co-body"
import { Response } from "./response"

import {
  CreateContextFunction,
  AliyunHttpRequest,
  AliyunHttpContext
} from "./types"

class Context {
  public constructor(
    private readonly originalReq: AliyunHttpRequest,
    public res: Response,
    private readonly originalCtx: AliyunHttpContext
  ) {}

  public get req() {
    return this.originalReq
  }

  public get credentials() {
    return this.originalCtx.credentials
  }

  public get service() {
    return this.originalCtx.service
  }

  public get query() {
    return this.originalReq.queries
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

  public set status(code: number) {
    this.status = code
  }

  public set body(value: any) {
    this.res.body = value
  }

  public get body() {
    return this.res.body
  }
}

export const createContext: CreateContextFunction = async (req, res, ctx) => {
  const response = new Response(res)
  const context = new Context(req, response, ctx)
  try {
    context.body = await parser(req)
  } catch (e) {
    console.log(e)
  }
  return context
}
