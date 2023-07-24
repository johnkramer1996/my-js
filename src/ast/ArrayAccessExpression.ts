import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import IVisitor from './IVisitor'

export default class ArrayAccessExpression implements IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    return this.getArray().get(this.lastIndex())
  }

  public getArray(array: ArrayValue = this.isArrayValue(Variables.get(this.variable)), i: number = 0): ArrayValue {
    if (i === this.lastIndex()) return array
    return this.getArray(this.isArrayValue(array.get(this.index(i))), ++i)
  }

  public lastIndex(): number {
    return this.index(this.indices.length - 1)
  }

  private index(index: number): number {
    return this.indices[index].eval().asNumber()
  }

  private isArrayValue(value: IValue): ArrayValue {
    if (value instanceof ArrayValue) return value
    throw new Error('Array expected')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.variable} ${this.indices}`)
  }
}
