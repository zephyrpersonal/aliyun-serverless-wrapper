import { AliyunHttpRequest } from "./types"

export class Request {
  public body: any

  public constructor(private readonly _req: AliyunHttpRequest) {}

  public get headers() {
    return this._req.headers
  }

  public get query() {
    return this._req.queries
  }

  public get path() {
    return this._req.path
  }

  public get url() {
    return this._req.url
  }

  public get method() {
    return this._req.method
  }

  public get ip() {
    return this._req.clientIp
  }
}
