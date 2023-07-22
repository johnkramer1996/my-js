export enum KeyWord {
  log,
}

export enum TokenType {
  WORD,
  NUMBER,
  TEXT,

  PLUS, // +
  MINUS, // -
  STAR, // *
  SLASH, // /
  PERCENT, // %

  LOG,

  EOF,
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
