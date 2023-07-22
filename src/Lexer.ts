import Token, { IToken, KeyWord } from 'Token'
import TokenType from 'TokenType'

export interface ILexer {
  tokenize(): IToken[]
}

export default class Lexer implements ILexer {
  private static OPERATOR_CHARS = '+-^&|'
  private static OPERATORS: Map<string, TokenType> = new Map([
    ['+', TokenType.PLUS],
    ['-', TokenType.MINUS],
    ['*', TokenType.STAR],
    ['/', TokenType.SLASH],
    ['%', TokenType.PERCENT],
    ['^', TokenType.CARET],
    ['&', TokenType.AMP],
    ['|', TokenType.BAR],
  ])
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
      else if (this.isLetter(char)) this.tokenizeWord()
      else if (this.isDigit(char)) this.tokenizeNumber()
      else if (this.isQuote(char)) this.tokenizeText()
      else if (this.isOperator(char)) this.tokenizeOperator()
      else throw new Error(`Unknown char "${this.peek()}"`)
    }
    return this.tokens
  }

  public isWhiteSpace(char: string): boolean {
    return [' ', '\n', '\t', '\r'].includes(char)
  }

  private isDigit(char: string): boolean {
    const n = char.charCodeAt(0)
    return n >= 48 && n < 58
  }

  public isLetter(char: string): boolean {
    const n = char.charCodeAt(0)
    return (n >= 65 && n < 91) || (n >= 97 && n < 123)
  }

  private isOperator(char: string): boolean {
    return Lexer.OPERATOR_CHARS.includes(char)
  }

  private isQuote(char: string): boolean {
    return Lexer.SINGLE_OR_DOUBLE_QUOTE.includes(char)
  }

  private tokenizeWord(): void {
    const str = []
    let current = this.peek(0)
    do {
      str.push(current)
      current = this.next()
    } while (this.isLetter(current))
    const word = str.join('')

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
    const str = []
    let current = this.peek(0)
    do {
      str.push(current)
      current = this.next()
    } while (this.isDigit(current))
    const number = str.join('')

    this.addToken(TokenType.NUMBER, number)
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
    this.next() // skip closing ' or "

    this.addToken(TokenType.TEXT, buffer.join(''))
  }

  private tokenizeOperator(): void {
    const operator = this.peek()
    this.next()
    this.addToken(Lexer.OPERATORS.get(operator) as TokenType, operator)
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
