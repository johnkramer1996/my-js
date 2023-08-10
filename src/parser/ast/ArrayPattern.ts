import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import BooleanValue from '@lib/BooleanValue'
import { IAccessible } from './IAccessible'
import { AssignmentPattern } from './AssignmentPattern'

export class ArrayPattern implements IAccessible, Iterable<IAccessible> {
  constructor(public elements: IAccessible[]) {}

  public eval(): IValue {
    return this.get()
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    if (!(value instanceof ArrayValue)) throw new Error('expect array')
    this.elements.forEach((variable, i) => variable.set(value.get(i)))
    return BooleanValue.FALSE
  }

  public define(value: IValue): IValue {
    if (!(value instanceof ArrayValue)) throw new Error('expect array')
    this.elements.forEach((variable, i) => variable.define(value.get(i)))
    return BooleanValue.FALSE
  }

  public getName(): string {
    return ''
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public [Symbol.iterator](): Iterator<IAccessible> {
    return this.elements[Symbol.iterator]()
  }
}
