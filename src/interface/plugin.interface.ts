export interface Api<T = any> {
  get options (): T
  version: string
}