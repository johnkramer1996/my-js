import Token, { IToken, KeyWord, TokenType } from 'Token'

export interface ILexer {
  tokenize(): IToken[]
}

export default class Lexer implements ILexer {
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
      if (this.isWhiteSpace()) this.next()
      else if (this.isLetter()) this.tokenizeWord()
      else throw new Error(`Unknown char "${this.peek()}"`)
    }
    return this.tokens
  }

  public isWhiteSpace(char: string = this.peek()): boolean {
    return [' ', '\n', '\t'].includes(char)
  }

  public isLetter(char: string = this.peek()): boolean {
    const n = char.charCodeAt(0)
    return (n >= 65 && n < 91) || (n >= 97 && n < 123)
  }

  public tokenizeWord(): void {
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
