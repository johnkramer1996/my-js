import TokenType from 'TokenType'

export enum KeyWord {
  log,
  if,
  else,
}

export interface IToken {
  getType(): TokenType
  getText(): string
}

export default class Token implements IToken {
  constructor(private type: TokenType, private text: string) {}

  public getType(): TokenType {
    return this.type
  }

  public getText(): string {
    return this.text
  }
}
