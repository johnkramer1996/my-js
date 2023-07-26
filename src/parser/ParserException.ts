export default class ParserException extends Error {
  constructor()
  constructor(message: string)
  constructor(message?: string) {
    super(message || '')
  }
}
