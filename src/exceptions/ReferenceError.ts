export default class ReferenceError extends Error {
  constructor(str: string) {
    super(str)
    this.name = 'ReferenceError'
  }
}
