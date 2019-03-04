import { IncomingMessage } from "http"

declare namespace MockReq {}
declare class MockReq extends IncomingMessage {
  public method: string
  public url: string
  public write(chunk: any): void
  public end(): void
  public constructor(options?: any)
}

export default MockReq
