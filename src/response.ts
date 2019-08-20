import { AliyunHttpResponse } from "./types"

const EMPTY_HTTP_STATUS_CODE = 204

export class Response {
  private _body: any
  private _status: number
  private _headers: { [key: string]: any } = {}
  private _type: string
  private _hasStatusSet: boolean = false

  public constructor(private readonly _res: AliyunHttpResponse) {}

  public get body() {
    return this._body
  }

  public set body(value: any) {
    if (value === null) {
      this.removeHeader("Content-Type")
      if (this.status !== EMPTY_HTTP_STATUS_CODE) {
        this.status = EMPTY_HTTP_STATUS_CODE
      }
      return
    }

    const hasTypeSet = !!this.header["Content-Type"]

    if (!this._hasStatusSet) this.status = 200

    if ("string" == typeof value) {
      !hasTypeSet &&
        (this.type = /^\s*</.test(value) ? "text/html" : "text/plain")
      this._body = value
      return
    }

    if (Buffer.isBuffer(value)) {
      this.type = "application/octet-stream"
      this._body = value.toString("base64")
      return
    }

    this.type = "application/json"
    this._body = JSON.stringify(value)
  }

  public get type() {
    return this._type
  }

  public set type(type: string) {
    this.setHeader("Content-Type", type)
  }

  public get status() {
    return this._status
  }

  public set status(code: number) {
    this._status = code
    if (code === EMPTY_HTTP_STATUS_CODE) this.body = null
    this._hasStatusSet = true
    this._res.setStatusCode(code)
  }

  public get header() {
    return this._headers
  }

  public removeHeader(field: string) {
    delete this._headers[field]
    this._res.deleteHeader(field)
  }

  public setHeader(field: string, val: string) {
    this._headers[field] = val
    this._res.setHeader(field, val)
  }

  public finish() {
    this._res.send(this._body || "")
  }

  public set(field: string | { [key: string]: string }, value?: string) {
    if (typeof field === "string") {
      this.setHeader(field, value)
    }
    if (typeof field === "object") {
      Object.keys(field).forEach((k) => {
        this.setHeader(k, field[k])
      })
    }
  }
}
