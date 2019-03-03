import parser from "co-body"

import {
  CreateContextFunction,
  AliyunHttpRequest,
  AliyunHttpResponse,
  AliyunHttpContext
} from "./types"

class Context {
  private requestBody: any
  constructor(
    private readonly originalReq: AliyunHttpRequest,
    private readonly originalRes: AliyunHttpResponse,
    private readonly originalCtx: AliyunHttpContext
  ) {}

  get res() {
    return this.originalRes
  }

  get req() {
    return this.originalReq
  }

  get credentials() {
    return this.originalCtx.credentials
  }

  get service() {
    return this.originalCtx.service
  }

  get requestId() {
    return this.originalCtx.requestId
  }

  get accountId() {
    return this.originalCtx.accountId
  }

  get function() {
    return this.originalCtx.function
  }

  get region() {
    return this.originalCtx.region
  }

  set status(code: number) {
    this.status = code
  }

  set body(value: any) {
    console.log(value)
    this.requestBody = value
  }

  get body() {
    return this.requestBody
  }
}

export const createContext: CreateContextFunction = async (req, res, ctx) => {
  const context = new Context(req, res, ctx)
  try {
    context.body = await parser(req)
    console.log(2)
  } catch (e) {
    console.log(e)
  }
  return context
}
