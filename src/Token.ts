export interface IToken {
  getType(): string
  getText(): string
}

export default class Token implements IToken {
  constructor(private type: string, private text: string) {}

  public getType(): string {
    return this.type
  }

  public getText(): string {
    return this.text
  }
}
