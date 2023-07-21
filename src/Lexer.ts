import { Token } from 'Token'

export interface ILexer {
  tokenize(): Token[]
}

export default class Lexer implements ILexer {
  private tokens: Token[] = []
  private text: string

  constructor(text: string) {
    this.text = text
  }

  public tokenize(): Token[] {
    for (const text of this.text.split(' ')) {
      this.tokens.push({ type: 'word', text })
    }
    return this.tokens
  }
}
