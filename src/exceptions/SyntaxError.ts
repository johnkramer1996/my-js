export default class SyntaxError extends Error {
  constructor(str: string) {
    super(str)
    this.name = 'SyntaxError'
  }
}
