import Token, { IToken } from 'Token'

export interface ILexer {
  tokenize(): IToken[]
}

export default class Lexer implements ILexer {
  private tokens: IToken[] = []
  private text: string

  constructor(text: string) {
    this.text = text
  }

  public tokenize(): IToken[] {
    for (const text of this.text.split(' ')) {
      this.tokens.push(new Token('word', text))
    }
    return this.tokens
  }
}
