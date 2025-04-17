export interface Api<T = unknown> {
  get options (): T
  version: string
}
