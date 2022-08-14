export interface IError {
  readonly error: string | Record<string, unknown>,
  readonly from: string,
  readonly timestamp: number,
}