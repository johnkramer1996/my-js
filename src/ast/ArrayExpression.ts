import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import { IExpression } from './IExpression'

export default class ArrayExpression implements IExpression {
  constructor(private elements: IExpression[]) {}

  public eval(): IValue {
    const size = this.elements.length
    const array = new ArrayValue(size)
    for (let i = 0; i < size; i++) array.set(i, this.elements[i].eval())
    return array
  }

  public toString(): string {
    return this.elements.toString()
  }
}
