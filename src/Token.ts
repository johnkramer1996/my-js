import TokenType from 'TokenType'

export enum KeyWord {
  log,
  if,
  else,
  while,
  for,
  do,
  break,
  continue,
  def,
  return,
  use,
}

export interface IToken {
  getType(): TokenType
  getText(): string
}

export default class Token implements IToken {
  constructor(private type: TokenType, private text: string, private row: number, private col: number) {}

  public getType(): TokenType {
    return this.type
  }

  public getText(): string {
    return this.text
  }

  public getRow(): number {
    return this.row
  }

  public getCol(): number {
    return this.col
  }

  public position(): string {
    return '[' + this.getRow() + ' ' + this.getCol() + ']'
  }

  public toString(): string {
    return `${TokenType[this.type]} ${this.position()} "${this.text}"`
  }
}
