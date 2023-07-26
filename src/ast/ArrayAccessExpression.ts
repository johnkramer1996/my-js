import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'

export default class ArrayAccessExpression implements IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    const container = Variables.get(this.variable)
    if (container instanceof ArrayValue) return this.getArray().get(this.lastIndex())
    return this.isMapValue(container).get(this.indices[0].eval().asString())
  }

  public getArray(array = this.isArrayValue(Variables.get(this.variable)), i: number = 0): ArrayValue {
    if (i === this.indices.length - 1) return array
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

  private isMapValue(value: IValue): MapValue {
    if (value instanceof MapValue) return value
    throw new Error('Map expected')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.variable} ${this.indices}`)
  }
}
