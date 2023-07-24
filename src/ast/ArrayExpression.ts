import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import { IExpression } from './IExpression'
import IVisitor from './IVisitor'

export default class ArrayExpression implements IExpression {
  constructor(public elements: IExpression[]) {}

  public eval(): IValue {
    const size = this.elements.length
    const array = new ArrayValue(size)
    for (let i = 0; i < size; i++) array.set(i, this.elements[i].eval())
    return array
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.elements.toString()
  }
}
