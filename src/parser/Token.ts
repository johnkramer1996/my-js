import TokenType from './TokenType'

export enum KeyWord {
  log,
  print,
  println,
  if,
  else,
  while,
  for,
  do,
  break,
  continue,
  def,
  function,
  return,
  use,
  match,
  case,
  extract,
  const,
  let,
  var,
  this,
  null,
  true,
  false,
  undefined,
  debugger,
}

export interface IToken {
  getType(): TokenType
  getText(): string
  getRaw(): string
  getStart(): number
  getEnd(): number
}

export default class Token implements IToken {
  constructor(private type: TokenType, private text: string, private raw: string, private row: number, private col: number, private start: number, private end: number) {}

  public getType(): TokenType {
    return this.type
  }

  public getText(): string {
    return this.text
  }

  public getRaw(): string {
    return this.raw
  }

  public getRow(): number {
    return this.row
  }

  public getCol(): number {
    return this.col
  }

  public getStart(): number {
    return this.start
  }

  public getEnd(): number {
    return this.end
  }

  public position(): string {
    return '[' + this.getRow() + ' ' + this.getCol() + ']'
  }

  public toString(): string {
    return `${TokenType[this.type]} ${this.position()} "${this.text}"`
  }
}
