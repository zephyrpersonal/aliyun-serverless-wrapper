import { AliyunHttpRequest } from "./types"

export class Request {
  public body: any

  constructor(private readonly _req: AliyunHttpRequest) {}

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
}
