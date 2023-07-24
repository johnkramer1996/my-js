export default class LexerException extends Error {
  constructor(message: string)
  constructor(message: string, row: number, col: number)
  constructor(message: string, row?: number, col?: number) {
    super(message + (row && col ? '[' + row + ':' + col + '] ' : ''))
  }
}
