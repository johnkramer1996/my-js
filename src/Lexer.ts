import Token, { IToken, KeyWord } from 'Token'
import TokenType from 'TokenType'

export interface ILexer {
  tokenize(): IToken[]
}

export default class Lexer implements ILexer {
  private static OPERATORS = new Map([
    ['+', TokenType.PLUS],
    ['-', TokenType.MINUS],
    ['*', TokenType.STAR],
    ['/', TokenType.SLASH],
    ['%', TokenType.PERCENT],
    ['!', TokenType.EXCL],
    ['^', TokenType.CARET],
    ['~', TokenType.TILDE],
    ['?', TokenType.QUESTION],
    [':', TokenType.COLON],
    ['&', TokenType.AMP],
    ['|', TokenType.BAR],
    ['<<', TokenType.LTLT],
    ['>>', TokenType.GTGT],
    ['>>>', TokenType.GTGTGT],
  ])
  private static OPERATOR_CHARS = '+-*/%()[]{}=<>!&|,^~?:'
  private static SINGLE_OR_DOUBLE_QUOTE = ["'", '"']

  private tokens: IToken[] = []
  private text: string
  private length: number
  private position = 0

  constructor(text: string) {
    this.text = text
    this.length = text.length
  }

  public tokenize(): IToken[] {
    while (this.position < this.length) {
      const char = this.peek()
      if (this.isWhiteSpace(char)) this.next()
      else if (this.isSemikolon(char)) this.tokenizeSemikolon()
      else if (this.isLetter(char)) this.tokenizeWord()
      else if (this.isDigit(char)) this.tokenizeNumber()
      else if (this.isOctothorp(char)) this.tokenizeHexNumber()
      else if (this.isQuote(char)) this.tokenizeText()
      else if (this.isOperator(char)) this.tokenizeOperator()
      else throw new Error(`Unknown char "${this.peek()}"`)
    }
    return this.tokens
  }

  public isWhiteSpace(char: string): boolean {
    return [' ', '\n', '\t', '\r'].includes(char)
  }

  private isSemikolon(char: string): boolean {
    return char === ';'
  }

  private isDigit(char: string): boolean {
    const n = char.charCodeAt(0)
    return n >= 48 && n < 58
  }

  public isLetter(char: string): boolean {
    const n = char.charCodeAt(0)
    return (n >= 65 && n < 91) || (n >= 97 && n < 123)
  }

  private isQuote(char: string): boolean {
    return Lexer.SINGLE_OR_DOUBLE_QUOTE.includes(char)
  }

  private isOctothorp(char: string): boolean {
    return char === '#'
  }

  private isHexNumber(char: string): boolean {
    return !!~'abcdef'.indexOf(char.toLowerCase())
  }

  private isOperator(char: string): boolean {
    return Lexer.OPERATOR_CHARS.includes(char)
  }

  private getNextChars(condition: (char: string) => boolean): string {
    const buffer = []
    let current = this.peek()
    do {
      buffer.push(current)
      current = this.next()
    } while (condition(current))
    return buffer.join('')
  }

  private tokenizeSemikolon(): void {
    this.skip()
    this.addToken(TokenType.SEMIKOLON)
  }

  private tokenizeWord(): void {
    const word = this.getNextChars(this.isLetter)

    switch (word) {
      case KeyWord[KeyWord.log]:
        this.addToken(TokenType.LOG, word)
        return
      default:
        this.addToken(TokenType.WORD, word)
        return
    }
  }

  private tokenizeNumber(): void {
    this.addToken(TokenType.NUMBER, this.getNextChars(this.isDigit))
  }

  private tokenizeHexNumber(): void {
    this.skip()
    const hexNumber = this.getNextChars((char) => this.isDigit(char) || this.isHexNumber(char))
    this.addToken(TokenType.HEX_NUMBER, hexNumber)
  }

  private tokenizeText(): void {
    const singleOrDoubleQuote = this.peek()

    const buffer: string[] = []
    for (let current: string; (current = this.next()) !== singleOrDoubleQuote; ) {
      if (current === '\\') {
        current = this.next()
        const escape = [
          { char: 'n', escape: '\n' },
          { char: 't', escape: '\t' },
        ].find(({ char }) => char === current)

        buffer.push(escape ? escape.escape : '\\')
        continue
      }
      buffer.push(current)
    }
    this.skip() // skip closing ' or "

    this.addToken(TokenType.TEXT, buffer.join(''))
  }

  private tokenizeOperator(): void {
    let current = this.peek()
    const buffer: string[] = []
    while (true) {
      buffer.push(current)
      const text = buffer.join('')
      current = this.next()
      if (!Lexer.OPERATORS.has(text + current)) {
        if (!Lexer.OPERATORS.has(text)) throw new Error(`Token ${text} not found`)
        this.addToken(Lexer.OPERATORS.get(text) as TokenType, text)
        return
      }
    }
  }

  private skip(): void {
    this.position++
  }

  private next(): string {
    this.position++
    return this.peek()
  }

  private peek(relativepos: number = 0): string {
    const position = this.position + relativepos
    if (position >= this.length) return '\0'
    return this.text[position]
  }

  private addToken(type: TokenType, text = ''): void {
    this.tokens.push(new Token(type, text))
  }
}
