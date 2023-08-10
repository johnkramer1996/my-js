import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IVisitor from './IVisitor'
import { IAccessible } from './IAccessible'
import { Location } from 'parser/Parser'

export class Identifier implements IAccessible {
  constructor(private name: string, public location: Location) {}

  public eval(): IValue {
    return Variables.get(this.getName())
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    return Variables.set(this.getName(), value), value
  }

  public define(value: IValue): IValue {
    return Variables.define(this.getName(), value), value
  }

  public getName(): string {
    return this.name
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name
  }

  public toHtml(): string {
    return `<span class='variable'>${this.name}</span>`
  }
}
